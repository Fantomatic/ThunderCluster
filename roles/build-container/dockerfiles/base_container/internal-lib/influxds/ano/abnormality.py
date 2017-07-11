'''
Created on May 2015
Update on May 2017

Use this code to operate on CPU and Memory metrics

@author: capgemini.cloudinfrastructurefrance.ac4dc
@copyright: capgemini 2015,2016,2017
'''

import os
import pandas as pd
import ano.api.peakDetection as pk
import influxds.helpers.fromCsvSerieToInfluxDB as csv_to_Idb
from config.YAML_configano import anosettings
import ano.api.stddevFromAverage as dfa 
from utils.UTILS_METRICS import get_metric_names
from utils.UTILS_METRICS import extract_all_InfluxDB_metrics as extract_all_metrics
from config.YAML_config import settings

output_ano_path = anosettings['common']['output_path'] 

def load_metrics_to_df(metricFilePath):
    """
#   @args:
#        metricFilePath : The path of the metric file to process
#   @return: 
#        df: A pandas dataframe that contains the given metric.
#            The frame will always be as follow:
#                    time              Value
#            2016-12-10T00:57:00Z      24
#            2016-12-10T01:00:00Z      18
#            ...                       ...
#            2016-12-12T17:30:00Z      32
#
    """
    # get config
    debug = anosettings['common']['debug']
    
    df = pd.read_csv(metricFilePath,sep=',',index_col=0,parse_dates=True)
    if debug==True:
        print df
    return df



def PEAKS(metrics_path):
    """
#  This function will recover all the metrics contained in the given "metrics_path" file.
#  (1 metric = 1 file) For each of those metrics, the Peak detection function will be 
#  applied. The results will then be written into the output_ano path file as:
#  "peak_detection_system_component_componentID_metric.csv".
#  Once generated, the peaks will be sent to InfluxDB with the following serie name:
#  "system_component_componentID_metric_peaks"
#  
#   @args:
#        metrics_path : The file path where the metrics to process are stored
#   @return: 
#        
    """    
    # get config
    debug = anosettings['common']['debug'] 
    
    # Recover the metrics elements: 'system', 'componentID' and 
    # 'metric_field' for each metric to get its file name
    metrics = get_metric_names()
     
    for metric in range (0, len(metrics)):
        # Get the metric system,componentID and field name.
        # Set the metric file name
        metric_system = metrics[metric][0]
        metric_componentID = metrics[metric][1]
        metric_field_name = metrics[metric][2]
        metric_file_name = "%s_%s_%s" %(metric_system,metric_componentID,metric_field_name)
        
        # Define the output file path
        output_path_file = output_ano_path+"peak_detection_%s.csv"%metric_file_name
        
        # Load the file and detect its peaks
        df = load_metrics_to_df(metrics_path+metric_file_name+".csv")
        ts = df['Value']
        #print ts
         
        peaksDetected=pk.peakDetection(ts,"_%s"%metric_file_name)
        if  peaksDetected==False:
            peaksLoaded=None
            print("No Peak")
        else:
            peaksLoaded=pd.read_csv(output_ano_path+\
                                    "peak_detection_%s.csv"%metric_file_name,
                                    sep=',',header=None,index_col=0,parse_dates=True)
            peaksLoaded.columns = [ "y"]
            print("Peak Loaded")
        
            # Add the "_peaks" to the serie name to dissociate it from the raw one 
            metrics[metric][2] = "%s_peaks"%metric_field_name
            header = ['time','Value']
            csv_to_Idb.write_data2(metrics[metric],header,output_path_file)
            
        if debug==True:
            print peaksLoaded


def STD_DEV_FROM_AVG(metrics_path):
    """
#  This function will recover all the metrics contained in the given "metrics_path" file.
#  (1 metric = 1 file) For each of those metrics, the standard deviation from average  
#  function will be applied. The results will then be written into the output_ano path file as:
#  "output_stddevavg_system_component_componentID_metric.csv".
#  Once generated, the stddevavg will be sent to InfluxDB with the following serie name:
#  "system_component_componentID_metric_stddevavg"
#  
#   @args:
#        metrics_path : The file path where the metrics to process are stored
#   @return: 
#        
    """
    
    # get config
    debug = anosettings['common']['debug'] 
    
    metrics = get_metric_names()
#     
    for metric in range (0, len(metrics)):
        metric_file_name = "%s_%s_%s" %(metrics[metric][0],metrics[metric][1],\
                                                metrics[metric][2])
        df = load_metrics_to_df(metrics_path+metric_file_name+".csv")
        ts = df['Value']
        print ts
         
        devFromAvgDetected=dfa.stddev_from_average(ts,"_%s"%metric_file_name)
        if  devFromAvgDetected==False:
            devFromAvgDetected=None
            print("No Standard deviation from average")
        else:
            devFromAvgDetected=pd.read_csv(output_ano_path + "output_stddevavg_%s.csv"%metric_file_name,
                                    sep=',',header=None,index_col=0,parse_dates=True)
            devFromAvgDetected.columns = [ "y"]
            print("Deviation from average Loaded")
        if debug==True:
            print devFromAvgDetected
     
     
    # Write the peaks to Influxdb
    # Open each new file and write it into InfluxDB with the appropriate header
    for metric in range (0, len(metrics)):
        metric_file_name = "%s_%s_%s" %(metrics[metric][0],metrics[metric][1],\
                                                metrics[metric][2])
        path_file = output_ano_path +"output_stddevavg_%s.csv"%metric_file_name
        if os.path.isfile(path_file):

            # Add the "_peaks" to the serie name to dissociate it from the raw one 
            metrics[metric][2] = "%s_stddevavg"%metrics[metric][2]
            header = ['time','Value']
            csv_to_Idb.write_data2(metrics[metric],header,path_file)



#===============================================================================
# main
#     as usual - operates the different works on data/output_ano
#===============================================================================
def ANO_main():
    
    # get config
    debug = anosettings['common']['debug'] 
     
    # The input data csv path files
    data_pathFile = settings['etc']['input']
      
    # The output path file for extracted metrics
    extract_pathFile = settings['etc']['input_metrics']
 
    # Load the metrics to process and write them to influxDb
    metrics = get_metric_names()
 
    if debug:
        print "##### Writing metrics to InfluxDB #####"
    csv_to_Idb.write_data(metrics,data_pathFile)
       
    # Extract each metric and store them in the extract_pathFile
    if debug:
        print "##### Extracting each metric from InfluxDB #####"
        print ("Extract_path: %s"%extract_pathFile )
    extract_all_metrics(extract_pathFile)
       
    # Apply the peaks detection and store the results into InfluxDB
    if debug:
        print "##### Apply the Peaks detection method #####"
    PEAKS(extract_pathFile)
       
    # Apply the DEV_FROM_AVG method and store the results into InfluxDB
    if debug:
        print "##### Apply the Deviation from average method #####"
    STD_DEV_FROM_AVG(extract_pathFile)    
    
    return 0


if __name__ == '__main__':
    ANO_main()

