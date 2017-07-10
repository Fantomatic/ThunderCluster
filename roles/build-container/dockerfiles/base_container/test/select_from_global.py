'''
Created on May 2015
Update on May 2017


@author: capgemini.cloudinfrastructurefrance.ac4dc
@copyright: capgemini 2015,2016,2017
'''

#extract the kth bloc of n lines from global file input_global inquired in config.YAML_config 
#for each instance and copi it in data_input inquired in config.YAML_configInputFormat
import pandas as pd
from config.YAML_configDemo1 import demo1settings
from config.YAML_config import settings
from config.YAML_configInputFormat import fmtsettings
from config.API_meanAbsoluteDeviation import meansettings

sep=','
debug = meansettings['mean_absolute_deviation']['debug']

def select_in_global(n,k):
    for instance in demo1settings:
        # Skipe the 'common' section
        if instance == 'common':
            continue
        filename = settings['etc']['input_global'] + instance + ".csv"
        if debug:
            print "select raws in :"
            print filename
            print "for instance :"
            print instance
        headerdf = pd.read_csv(filename, sep=sep,parse_dates=True, nrows = 0)
        df = pd.read_csv(filename, sep=sep,parse_dates=True, nrows = n , skiprows = k*n+1,header=None)
        df.columns = headerdf.columns
        filename = fmtsettings['data_input_semicolon'][0] + instance + ".csv"
        if debug:
            print "copy df :"
            print df
            print "and paste df as : "
            print filename
        f = open (filename,'w+')
        df.to_csv(f,index=False)
    return 0

if __name__ == '__main__':     
    select_in_global(2016,0)