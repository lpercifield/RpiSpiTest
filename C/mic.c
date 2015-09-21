#include "./mic.h"
#define DEPTH 128

static int myFd ;

unsigned long int GetMic(void);
unsigned long int samples[DEPTH];
unsigned long int sum;
double noice;


int main(){
	unsigned char ShiftCounter,i;
	clock_t now=0, prev=0;
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
		if(now>(prev+3000)){
		    //printf("%d\n",GetMic());
		  prev=now;
			sum=0;
      for(ShiftCounter=0;ShiftCounter<DEPTH-1;ShiftCounter++){
			   samples[ShiftCounter]=samples[ShiftCounter+1];
			   sum+=samples[ShiftCounter];
			}
			samples[DEPTH-1]=(GetMic()+samples[DEPTH-2]+samples[DEPTH-3]+samples[DEPTH-4]+samples[DEPTH-5])/5;
			sum+=samples[DEPTH-1];
			sum/=DEPTH;
			noice=10*log10f(abs(((double)sum-(double)samples[DEPTH-1])/100));
		    if(noice>0){
			    //printf("%f\n",noice);
				for(i=0;i<(int)noice;i++){
					printf(" ");
				}
				printf("*\n");
			}
		}

	}printf("%s\n", );
	close(myFd);
	return(0);
}

unsigned long int GetMic(void){
	unsigned char spiData [3]={0x00,0x00,0x00};
	wiringPiSPIDataRW(1, spiData, 3);
	return (  ((spiData [0]<<16)&0x0F0000) | ((spiData[1]<<8)&0xFF00) | (spiData[2]&0xFF) );
}
