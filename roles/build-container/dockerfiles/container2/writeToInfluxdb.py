'''
Created on July 2017

Use this code to write data to Influxdb

@author: capgemini.cloudinfrastructurefrance.ac4dc
@copyright: capgemini 2017
'''

import influxdb
import datetime
import time

# Set the Influxdb parameters
Idb_username = "admin"
Idb_password = "admin"
Idb_database = "testDocker"
Idb_host = "localhost"
Idb_measurement_name = "dataTestMeasurement"

# Set the data to send
data_to_send = ['data1','data2','data3','data4']

# Set the debug variable
debug = True

#===============================================================================
# get_db
#    @return:
#        return InfluxDBClient object db
# create a InfluxDBClient object to connect as username to Idb_database database
# of influxdb.
#===============================================================================
def get_db():
    db = influxdb.InfluxDBClient(host=Idb_host, username=Idb_username, password=Idb_password, database=Idb_database)
    return db

#===============================================================================
# format_influxMetric_data
#    @args :
#        data: list to send to Influxdb
#    @return:
#        influx_data: the data formated in json
#===============================================================================
def format_influxMetric_data(input_data):
	
    # Initialise the returned table
    influx_data = []

    # Format the data
    for data in range (0, len(input_data)):

	# Get the current time
    	curr_time = datetime.datetime.now()

        curr_metric = {
            "measurement": Idb_measurement_name,
            "time": curr_time,
            "fields":  {
                "Value": input_data[data]
                }
        }
        influx_data.append(curr_metric)

    if debug:
        print ("Writing %s data..."%(Idb_measurement_name))

    return influx_data


#===============================================================================
# write_db
#    @args :
#        serie of elements to write in the Influxdb database
#    @return:
#
#===============================================================================
def write_db(serie):
    db=get_db()
    #print db
    db.write_points(serie)
    #check(db)
    return 0

if __name__ == '__main__':

    # Format the data to send
    data_to_send = format_influxMetric_data(data_to_send)

    # Write it in Influxdb
    while(1):
        write_db(data_to_send)

