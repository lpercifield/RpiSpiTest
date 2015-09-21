#include "./mq7.h"

//functions declarations
time_t CurrentTimeInSeconds(void);
time_t  HowMuchTimePassed(void);//return time in seconds from the last ResetTime() called
void ResetTime(void);//reset internal software clock
unsigned int GetADC(unsigned char channel);
int command(char *cmd);

//global variables
clock_t now, previous;
	
int main(){
	unsigned char step=0;
	unsigned char sv[5];
	clock_t showPrev, showCurrent, durationCounter=0;
	
	ResetTime();//reset local time to 0
    if(wiringPiSetupGpio()==-1){
        exit(1);
    }else{
        printf("wiringPi lib opened\n");
    }
	
	if (wiringPiSPISetup (MQ7_SPI_CHAN, 1000000) < 0){
        exit (1) ;
    }else{
        printf("SPI lib opened\n");
    }
	
	pinMode(MQ7_VOLTAGE_PIN,OUTPUT);
	
	showCurrent=CurrentTimeInSeconds();
	showPrev=showCurrent;
	
	printf("START - %s\n", command("date"));
	printf("________________________________________________\n");
    while(1){
		
		showCurrent=CurrentTimeInSeconds();
		if((showCurrent-showPrev)>=2){
			printf("voltage;%s;MQ7;%0-4d;MQ135;%-4d\n",sv,GetADC(0), GetADC(1));
			showPrev=showCurrent;
			if(durationCounter++>600){
				step=255;
			}
		}
		
		switch(step){
			case 0:{//set high voltage
			    digitalWrite(MQ7_VOLTAGE_PIN,HIGH);
				sprintf(sv,"HIGH");
				ResetTime();
				step = 10;
				break;
			}
			case 10:{//releasing  HIGH voltage some time
				if(HowMuchTimePassed()>=HIGH_DURATION){//jump to switching to LOW voltage
				   	step=20;
				}
				break;
			}
			case 20:{
				digitalWrite(MQ7_VOLTAGE_PIN,LOW);
				sprintf(sv,"LOW ");
				ResetTime();
				step = 30;
				break;
			}
			case 30:{//releasing  HIGH voltage some time
				if(HowMuchTimePassed()>=LOW_DURATION){//jump to switching to HIGH voltage
					step=0;
				}
				break;
			}
			case 255:{
				digitalWrite(MQ7_VOLTAGE_PIN,HIGH);
				printf("STOP - %s\n", command("date"));
	            printf("________________________________________________\n");
				return(0);
				break;
			}
		}
	}	

}


//functions definitions
time_t CurrentTimeInSeconds(void){
	return(clock()/CLOCKS_PER_SEC);
}

void ResetTime(void){
	now=CurrentTimeInSeconds();
	previous=now;
}

time_t HowMuchTimePassed(void){
	//now=;
	return(CurrentTimeInSeconds() - previous);
}

unsigned int GetADC(unsigned char channel){
	unsigned char spiData [3]={1,0b10000000|(channel << 4),0};
	wiringPiSPIDataRW(0, spiData, 3);
	return ((spiData [1]<<8)|spiData[2])&0x3FF;
}

int command(char *cmd){
     pid_t chpid, w;
     int status;

     if ((chpid = fork()) == 0) {
         execlp("sh", "sh", "-c", cmd, (char *) 0);
         exit(127);
     }
     
	 while ((w = wait(&status)) != chpid && w != -1);       /* null */
     if (w == -1){
         return(-1);
	 }else{
		 return(WEXITSTATUS(status));
	 }
}