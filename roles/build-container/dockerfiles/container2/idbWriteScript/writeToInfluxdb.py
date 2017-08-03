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
idb_username = "admin"
idb_password = "admin"
idb_database = "testDocker"
idb_host = "localhost"
idb_measurement_name = "dataTestMeasurement"

# Set the data to send
data_to_send = ['data1','data2','data3','data4']

# Set the debug variable
debug = True

#===============================================================================
# get_db
#    @return:
#        return InfluxDBClient object db
# create a InfluxDBClient object to connect as username to idb_database database
# of influxdb.
#===============================================================================
def get_db():
    db = influxdb.InfluxDBClient(host=idb_host, username=idb_username, password=idb_password, database=idb_database)
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
            "measurement": idb_measurement_name,
            "time": curr_time,
            "fields":  {
                "Value": input_data[data]
                }
        }
        influx_data.append(curr_metric)

    if debug:
        print ("Writing %s data..."%(idb_measurement_name))

    return influx_data


if __name__ == '__main__':
    # Get the database
    db=get_db()

    # Write data to Influxdb
    while(1):
	# Format the data to send
    	formated_data = format_influxMetric_data(data_to_send)
	try:
            db.write_points(formated_data)
            print "Write succeeded"
    	except Exception as e:
            print "Write failed: ", e, type(e)
        time.sleep(5)









