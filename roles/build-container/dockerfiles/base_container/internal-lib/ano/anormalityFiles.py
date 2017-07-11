'''
Created on 27 mai 2017

@author: util1
'''
import pandas as pd
# import the configuration for this module
from config.YAML_configano import anosettings
from config.TRD_LSTMnn import lstmnnsettings

#===============================================================================
# buildStdFileName
#    @args:
#        coreFilename:    string as the core filename to generate
#        metricName:    string as the suffix added to filename
#        extension:    string as a standard MIME extension (.csv, .png,...)
# generates a file name into the right anomaly module output path (read from
# configuration file)
#===============================================================================
def buildStdFileName(coreFilename,metricName,extension,duration=None):
    if duration is None:
        stdFilename=anosettings['common']['output_path']
    elif duration=='H':
        stdFilename=lstmnnsettings ['common']['output_path_resH']
    elif duration=='W':
        stdFilename=lstmnnsettings ['common']['output_path_resW']    
    elif duration=='Y':
        stdFilename=lstmnnsettings ['common']['output_path_resY']    
    else:
        print "is a bad parameter for duration in ano.anormalityFiles.buildStdFileName"
    print stdFilename
    stdFilename=stdFilename+coreFilename
    stdFilename=stdFilename+metricName
    stdFilename=stdFilename+extension
    return stdFilename

#===============================================================================
# buildKeyValueCSV
#    @args:
#        key : a string name
#        value : a numerical (or boolean) - warn : a str is applied to value
# generate a line of csv file with comma separated key value and a \n at end
#===============================================================================
def buildKeyValueCSV(key,value):
    content=key
    content= content +','
    content= content + str(value)
    content= content +'\n'
    return content
    
#===============================================================================
# append2synthesisFile
#    @args:
#        metricName : name of the metric studied
#        testName: name of the test passed
#        value : True or False
# append a line testName,value to the synthesis file
# the synthesis file is just a CSV file that details all tests 
# if the test is True an anormality has been found, some tests have
# supplementary files for listing values details
#===============================================================================
def append2synthesisFile(metricName,testName,value,duration=None):
    # get configuration filename
    filenameStd=buildStdFileName(
        anosettings['common']['synthesis_file'],
        metricName,
        ".csv",duration=duration)
    # build content
    content = buildKeyValueCSV(testName, value)
    # open file into append mode
    with open(filenameStd, "a") as myfile:
        myfile.write(content)
    
#===============================================================================
# append2globalFile
#    @args:
#        metricName : name of the metric studied
#        testName: name of the test passed
#        value : True or False
# append a line testName,value to the global file
# the global file is just a CSV file that details a list of basic statistics 
# if the test is True an anormality has been found, some tests have
# supplementary files for listing values details
#===============================================================================
def append2GlobalFile(metricName,testName,value,duration=None):
    # get configuration filename
    filenameStd=buildStdFileName(
        anosettings['common']['global_file'],
        metricName, 
        ".csv",duration=duration)
    # build content
    content = buildKeyValueCSV(testName, value)
    # open file into append mode
    with open(filenameStd, "a") as myfile:
        myfile.write(content) 

#===============================================================================
# saveSeries2CSV
#    @args:
#        timeseries (timestamp,value)
#        filenameCore (use to generate filename)
#        metricName (append to filenameCore)
#    @return:
#        always True at this step
# Write a csv file (utf-8) from a timeseries issued from pandas
#===============================================================================
def saveSeries2CSV(timeseries,filenameCore,metricName,duration=None):
    # build file
    filenamePeak=buildStdFileName(
        filenameCore, 
        metricName, 
        ".csv",duration=duration)
    timeseries.to_csv(filenamePeak,encoding='utf-8')
    return True