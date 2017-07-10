'''
Created on May 2015
Update on May 2017

Use this code to operate on CPU and Memory metrics

@author: capgemini.cloudinfrastructurefrance.ac4dc
@copyright: capgemini 2015,2016,2017
'''
import os
import pandas as pd
from config.TRD_LSTMnn import lstmnnsettings
import ano.api.peakDetection as pk
from utils.UTILS_METRICS import get_metric_names
import influxds.helpers.fromCsvSerieToInfluxDB as csv_to_Idb
from config.YAML_config import settings
from config.YAML_configano import anosettings
from trend import statsTrend
from fbprophet import Prophet



#===============================================================================
# main
#     as usual - operates the different works on data/output_ano
#===============================================================================
def TRENDS_main():
# get config
    debug = lstmnnsettings['stats_trend']['debug'] 
 
    # Set the unit for the trends: H (hour), D (day), W(week), Y(year)
    duration = 'H'
       
    # Get the metrics folder path and metrics names
    input_metrics_path = settings['etc']['input_metrics']
    output_ano_path = anosettings['common']['output_path']
    output_pred_path = lstmnnsettings['common']['output_path']
    statics_data_path = settings['etc']['statics_data']
    
    metrics = get_metric_names()
    
# Apply the process for each metric
    for n in range (0,len(metrics)):
        cur_system = metrics[n][0]
        cur_component = metrics[n][1]
        cur_componentID = metrics[n][2]
        metric_name = "%s_%s_%s"%(metrics[n][0],metrics[n][1],metrics[n][2])
        
        # do a test in hours this time...
        # load values as (timeStamp,values)
        df=statsTrend.loadMetric(input_metrics_path+metric_name+".csv")
        # Check if we have unique values
        dfUnique= df.Value.unique()
        if len(dfUnique)==1:
            trend = df
            predict = df 
        else:     
            ts=df['Value']
            if debug==True:
                print ts
            peaksDetected=pk.peakDetection(ts,"Value")
            if  peaksDetected==False:
                peaksLoaded=None
                print("No Peak")
            else:
                peaksLoaded=pd.read_csv(output_ano_path+"peak_detection_"+metric_name+".csv",
                                    sep=',',header=None,index_col=0,parse_dates=True)
            
                print("Peak Loaded")
            if debug==True:
                print peaksLoaded
            # load holidays as (timestamp)
            holidays_file = statics_data_path +"holidays2016.csv"
            holidaysDf=pd.read_csv(holidays_file)
            if debug==True:
                print("VACANCES")
                print holidaysDf
            # normalize df to be prophet compatible
            pDf = statsTrend.NormalizeDataFrame("Value",df, dfPeaks=peaksLoaded)
            if debug==True:
                print pDf
                 
            # build series with holidays
            model = statsTrend.buildModel(pDf,holidaysDf)
            # fit model with period of prediction of 4 hours ...
            forecast= statsTrend.buildTrends(model,4,duration)
            forecast= statsTrend.unnormalizeForecast(forecast, duration)
            if debug==True:
                print "*********** final*************"
                print forecast
            
            # Rename the index 'time' to respect the influxDB format
            forecast=forecast.rename(columns = {'ds':'time'})
            forecast['time'] = forecast['time'].apply(lambda x: x.strftime('%Y-%m-%dT%H:%M:%SZ'))
            
            # Extract trend('trend' column) and predicted ('yhat') value
            # and rename them in order to write them into influxDB.
            # Set the index as the 'time' column
            trend = forecast[['time','trend']].copy()
            trend=trend.rename(columns = {'trend':'Value'})
            trend.set_index('time', inplace=True)
            
            predict = forecast[['time','yhat']].copy()
            predict=predict.rename(columns = {'yhat':'Value'})
            predict.set_index('time', inplace=True)
            
            # If there are enaough data in the dataframe to generate weekly and 
            # yearly predictions, recover those information
            if 'weekly' in forecast.columns:
                predict_weekly = forecast[['time','weekly']].copy()
                predict_weekly=predict_weekly.rename(columns = {'weekly':'Value'})
                predict_weekly.set_index('time', inplace=True)
                
            if 'yearly' in forecast.columns:
                predict_yearly = forecast[['time','yearly']].copy()
                predict_yearly=predict_yearly.rename(columns = {'yearly':'Value'})
                predict_yearly.set_index('time', inplace=True)
                
                             
        (trend.head(n=((len(trend.index))-4))).to_csv(output_pred_path+"trendOriginal"+'_'+metric_name+".csv")
        path_file = output_pred_path +"trendOriginal"+'_'+"%s.csv"%metric_name
        if os.path.isfile(path_file):

            # Add the "_peaks" to the serie name to dissociate it from the raw one and
            # write them into InfluxDB
            cur_componentID_trendOriginal = "%s_trendOriginal"%(cur_componentID)
            csv_to_Idb.write_data3([cur_system,cur_component,cur_componentID_trendOriginal],path_file)
        if debug:
            print ("trendOriginal_%s.csv has been generated"%(metric_name))
            
        # Write the trend data file
        (trend.tail(n=4)).to_csv(output_pred_path+"trend"+'_'+metric_name+".csv")
        path_file = output_pred_path +"trend"+'_'+"%s.csv"%metric_name
        if os.path.isfile(path_file):

            # Add the "_peaks" to the serie name to dissociate it from the raw one and
            # write them into InfluxDB
            cur_componentID_trend = "%s_trend"%(cur_componentID)
            csv_to_Idb.write_data3([cur_system,cur_component,cur_componentID_trend],path_file)
        if debug:
            print ("trend%s_%s.csv has been generated"%(duration,metric_name))
            
            
        # Write the predict data file: hourly and weekly + yearly if exist
        (predict.tail(n=4)).to_csv(output_pred_path+"trendPredictH"+'_'+metric_name+".csv")
        path_file = output_pred_path + "trendPredict"+duration+'_'+"%s.csv"%metric_name
        if os.path.isfile(path_file):

            # Add the "_trendPredict" to the serie name to dissociate it from the raw one and
            # write them into InfluxDB
            cur_componentID_predict = "%s_predict_H"%(cur_componentID)
            csv_to_Idb.write_data3([cur_system,cur_component,cur_componentID_predict],path_file)
        
        if 'weekly' in forecast.columns:
            (predict_weekly.tail(n=4)).to_csv(output_pred_path+"trendPredictW_"+metric_name+".csv")
            weekly_path_file = output_pred_path +"trendPredictW_%s.csv"%metric_name
            if os.path.isfile(weekly_path_file):
                # Add the "_trendPredict" to the serie name to dissociate it from the raw one and
                # write them into InfluxDB
                cur_componentID_predict_weekly = "%s_predict_W"%(cur_componentID)
                csv_to_Idb.write_data3([cur_system,cur_component,cur_componentID_predict_weekly],weekly_path_file)

        if 'yearly' in forecast.columns:
            (predict_yearly.tail(n=4)).to_csv(output_pred_path+"trendPredictY_"+metric_name+".csv")
            yearly_path_file = output_pred_path +"trendPredictY_%s.csv"%metric_name
            if os.path.isfile(yearly_path_file):
                # Add the "_trendPredict" to the serie name to dissociate it from the raw one and
                # write them into InfluxDB
                cur_componentID_predict_yearly = "%s_predict_Y"%(cur_componentID)
                csv_to_Idb.write_data3([cur_system,cur_component,cur_componentID_predict_yearly],yearly_path_file)
                
        if debug:
            print ("trendPredict_%s.csv has been generated"%(metric_name))

        
if __name__ == '__main__':
    TRENDS_main()