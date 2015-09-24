#include "./mic.h"
#define DEPTH 31
#define NWIDTH 20 /* Size of the data buffer; length of the sequence. */
#define STOPPER 0 /* Smaller than any datum */

static int myFd ;

unsigned long int GetMic(void);
unsigned long int samples[DEPTH];
unsigned long int sum;
unsigned long int sample;
unsigned long int sampleCount = 0;
unsigned long int signalMax = 0;
unsigned long int signalMin = 32768;
unsigned long int peakToPeak;
unsigned long int peakToPeakMedian;
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
		if(now>(prevSample+3000)){
			sample = GetMic();
		    //printf("%d\n",sample);
			sampleCount++;
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
			if(peakToPeak>0){
				peakToPeakMedian = medfilter(peakToPeak);
				printf("%d\n",peakToPeakMedian);
			}
			//printf("%d\n",sampleCount);
			signalMax = 0;
			signalMin = 32768;
			sampleCount = 0;
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
unsigned int medfilter(unsigned int datum)
{
    unsigned int i;
    struct pair
    {
        struct pair   *point;  /* Pointers forming list linked in sorted order */
        unsigned int  value;  /* Values to sort */
    };
    static struct pair buffer[NWIDTH];  /* Buffer of nwidth pairs */
    static struct pair *datpoint={buffer}  /* pointer into circular buffer of data */;
    static struct pair small={NULL,STOPPER} ;  /* chain stopper. */
    static struct pair big={&small,0} ;  /* pointer to head (largest) of linked list.*/
    struct pair *successor   ;  /* pointer to successor of replaced data item */
    struct pair *scan        ;  /* pointer used to scan down the sorted list */
    struct pair *scanold     ;  /* previous value of scan */
    struct pair *median;     ;  /* pointer to median */

    if(datum == STOPPER) datum = STOPPER + 1; /* No stoppers allowed. */
    if( (++datpoint - buffer) >= NWIDTH) datpoint=buffer;  /* increment and wrap data in pointer.*/
    datpoint->value=datum        ;  /* Copy in new datum */
    successor=datpoint->point    ;  /* save pointer to old value's successor */
    median = &big                ;  /* median initially to first in chain */
    scanold = NULL               ;  /* scanold initially null. */
    scan = &big                  ;  /* points to pointer to first (largest) datum in chain */
  /* Handle chain-out of first item in chain as special case */
        if( scan->point == datpoint ) scan->point = successor;
        scanold = scan ;            /* Save this pointer and   */
        scan = scan->point ;        /* step down chain */
  /* loop through the chain, normal loop exit via break. */
    for( i=0 ;i<NWIDTH ; i++ )
    {
     /* Handle odd-numbered item in chain  */
        if( scan->point == datpoint ) scan->point = successor;  /* Chain out the old datum.*/
        if( (scan->value < datum) )        /* If datum is larger than scanned value,*/
        {
            datpoint->point = scanold->point;          /* chain it in here.  */
            scanold->point = datpoint;          /* mark it chained in. */
            datum = STOPPER;
        };
  /* Step median pointer down chain after doing odd-numbered element */
        median = median->point       ;       /* Step median pointer.  */
        if ( scan == &small ) break ;        /* Break at end of chain  */
        scanold = scan ;          /* Save this pointer and   */
        scan = scan->point ;            /* step down chain */
  /* Handle even-numbered item in chain.  */
        if( scan->point == datpoint ) scan->point = successor;
        if( (scan->value < datum) )
        {
            datpoint->point = scanold->point;
            scanold->point = datpoint;
            datum = STOPPER;
        };
        if ( scan == &small ) break;
        scanold = scan ;
        scan = scan->point;
    };
    return( median->value );
}
