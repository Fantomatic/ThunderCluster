'''
Created on May 2015
Update on May 2017

Use this code to activate profiling logs
Start and stop the profiler with:
    >>> myProfiler = start_internalProfiler()
    >>> # Do something you want to profile
    >>> stop_internalProfiler(myProfiler, "out.txt", "cumulative")

@author: capgemini.cloudinfrastructurefrance.ac4dc
@copyright: capgemini 2015,2016,2017
'''
 
import cProfile
import pstats
import six


 
 
#===============================================================================
# start_internalProfiler()
#    @args : None
#    @return : an object cProfile.profile that is a profiler
# Helper function to start the profiler process
# Warn : do not forget to stop it with stop_internalProfiler()
#===============================================================================
def start_internalProfiler():
    
    profiler = cProfile.Profile()
    profiler.enable()
    return profiler


#===============================================================================
# stop_internalProfiler
# @args
#        profiler : the object returned from start_internalProfiler
#        sortStatsParam : this is None or a string accepted by sort_Stats()
#                         primitive on stats object used by profiler (see Python
#                         doc) - use "cumulative" in most cases
#        filename2Save : filename (with path) where to put the profiling trace
# @return : nothing
# This functions stops a profiler and save the stats object into a text file
#===============================================================================
def stop_internalProfiler(profiler,sortStatsParam,filename2Save):
    
    # code directly copied from python documentation...
    
    profiler.disable()
    s = six.StringIO()
    # sorting Param = none, "cumulative",... see doc
    ps = pstats.Stats(profiler, stream=s).sort_stats(sortStatsParam)
    # human readable format
    ps.print_stats()

    file2save = open(filename2Save, "w")
     
    file2save.write(s.getvalue())
    file2save.close()