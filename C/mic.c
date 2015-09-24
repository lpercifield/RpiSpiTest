#include "./mic.h"
#define DEPTH 128

static int myFd ;

unsigned long int GetMic(void);
unsigned long int samples[DEPTH];
unsigned long int sum;
unsigned long int sample;
unsigned long int signalMax = 0;
unsigned long int signalMin = 65536;
unsigned long int peakToPeak;
double noice;


int main(){
	unsigned char ShiftCounter,i;
	clock_t now=0, prevSample=0, prevAverage = 0;
	printf("Hello, I'm microphone!\n");
	if(wiringPiSetupGpio()==-1){
        exit(1);
    }else{
        printf("wiringPi lib opened\n");
    }

	if ((myFd = wiringPiSPISetup (MIC_SPI_CHAN, 6000000)) < 0){
        exit (1) ;
    }else{
        printf("SPI lib opened\n");
    }

	while(1){
		//now=clock()*100/CLOCKS_PER_SEC;
		now=clock();
		if(now>(prevSample+30000)){
			sample = GetMic();
		    //printf("%d\n",sample);
		  prevSample=now;
			if (sample > signalMax){
				signalMax = sample;  // save just the max levels
			}else if (sample < signalMin){
				signalMin = sample;  // save just the min levels
			}
		}// sample
		if(now>(prevAverage+300000)){
			peakToPeak = 0;
			peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
			printf("%d\n",peakToPeak);
			signalMax = 0;
			signalMin = 65536;
			prevAverage = now;
		}
	}//printf("%s\n", );
	close(myFd);
	return(0);
}

unsigned long int GetMic(void){
	unsigned char spiData [3]={0x00,0x00,0x00};
	wiringPiSPIDataRW(1, spiData, 3);
	//return (  ((spiData [0]<<16)&0x0F0000) | ((spiData[1]<<8)&0xFF00) | (spiData[2]&0xFF) );
	return ( (spiData [0] << 11) | (spiData [1] << 3 ) | (spiData [2] >> 5 ));
}
