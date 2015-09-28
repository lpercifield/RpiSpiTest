# ver 2.5 User Configuration variable settings for pi-timolo.py
# Purpose - Motion Detection and Time Lapse Camera
# Created - 06-May-2015
# Done by - Claude Pageau
 
configTitle = "pitimolo default configuration motion and timelapse 1080p images"
configName = "pitimolo-default-config"

# These settings should both be False if this script is run as a background /etc/init.d daemon
verbose = False             # Sends detailed logging info to console. set to False if running script as daeman
logDataToFile = False      # logs diagnostic data to a disk file for review  default=False
# print a test image
imageTestPrint = False     # default=False Set to True to print one image and exit (useful for aligning camera)

# Image Settings
imageNamePrefix = 'cam1-'  # Prefix for all image file names. Eg front-
imageWidth = 1920          # Full Size Image Width in px  default=1980
imageHeight = 1080         # Full Size Image Height in px default=1080
imageVFlip = False         # Flip image Vertically    default=False
imageHFlip = False         # Flip image Horizontally  default=False
imagePreview = False       # Preview image on connected RPI Monitor default=False
noNightShots = False       # Don't Take images at Night default=False
noDayShots = False         # Don't Take images during day time default=False  

# Low Light Night Settings
nightMaxShut = 5.0         # default=5 sec Highest cam shut exposure time. IMPORTANT 6 sec works sometimes but occasionally locks RPI and HARD reboot required to clear
nightMinShut = .001        # default=.002 sec Lowest camera shut exposure time for transition from day to night (or visa versa)
nightMaxISO = 800          # default=800  Max cam ISO night setting
nightMinISO = 100          # lowest ISO camera setting for transition from day to night (or visa versa)  
nightSleepSec = 10         # default=10 Sec - Time period to allow camera to calculate low light AWB   
nightDayTimer = 2 * 60     # (Not used in ver 1.2) Check stream changes to determine if entering twilight zones
twilightThreshold = 5     # Adjust for lighting conditions for day/night mode switching normal setting is between 50 and 100

# Date/Time Settings for Displaying info Directly on Images
showDateOnImage = False     # Set to False for No display of date/time on image default= True
showTextBottom = True      # Location of image Text True=Bottom False=Top
showTextWhite = True       # Colour of image Text True=White False=Black
showTextWhiteNight = True  # Change night text to white.  Might help if night needs white instead of black during day or visa versa

# Motion Detect Settings
motionOn = True            # True = motion capture is turned on.  False= No motion detection
motionPrefix = "mo-"       # Prefix Motion Detection images
motionDir = "motion"       # Storage Folder for Motion Detect Images
threshold = 10             # How much a pixel has to change to be counted default=10 (1-200)
sensitivity = 200          # Number of changed pixels to trigger motion default=300
motionVideoOn = False      # If set to True then video clip is taken rather than image
motionVideoTimer = 10      # Number of seconds of video clip to take if Motion Detected default=10
motionQuickTLOn = False    # If set to True then take a quick time lapse sequence rather than a single image (overrides motionVideoOn)
motionQuickTLTimer = 2    # Duration in seconds of quick time lapse sequence after initial motion detected default=10
motionQuickTLInterval = 0  # Time between each Quick time lapse image 0 is fast as possible 
motionForce = 90000      # Force single motion image if no Motion Detected in specified seconds.  default=60*60
motionNumOn = True         # True=On (filenames by sequenced Number) otherwise date/time used for filenames
motionNumStart = 1000      # Start motion number sequence
motionNumMax  = 2        # Max number of motion images desired. 0=Continuous    default=0
motionNumRecycle = True    # After numberMax reached restart at numberStart instead of exiting default=True
motionMaxDots = 100        # Number of motion dots before starting new line
createLockFile = False     # default=False if True then indicates syncing of files with remote google drive is required
                           # Lock File is used to indicate motion images are added. previously used for grive but not required until grive fixed 

# Time Lapse Settings
timelapseOn = True         # Turns timelapse True=On  False=Off
timelapseTimer = 1 * 35    # Seconds between timelapse images  default=5*60
timelapseDir = "timelapse" # Storage Folder for Time Lapse Images
timelapsePrefix = "tl-"    # Prefix timelapse images with this prefix
timelapseExit = 0 * 60     # Will Quit program after specified seconds 0=Continuous  default=0
timelapseNumOn = True      # True=On (filenames Sequenced by Number) otherwise date/time used for filename
timelapseNumStart = 1000   # Start of timelapse number sequence 
timelapseNumMax = 50      # Max number of timelapse images desired. 0=Continuous  default=0
timelapseNumRecycle = True # After numberMax reached restart at numberStart instead of exiting default=True   

# ---------------------------------------------- End of User Variables -----------------------------------------------------
