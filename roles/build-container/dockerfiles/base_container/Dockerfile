FROM centos:7
MAINTAINER G.CUPILLARD (Sogeti France)

RUN yum update -y 
RUN yum install epel-release -y 
RUN yum install python-pip gcc python-devel git cmake3 -y
RUN pip install --upgrade pip 
RUN pip install pandas scipy peakutils matplotlib statsmodels pyyaml datetime cython pystan seaborn
RUN pip install fbprophet influxdb keras
# Build and install lingpuarray for Theano
#RUN git clone https://github.com/Theano/libgpuarray.git  && cd ./libgpuarray && git checkout tags/v0.6.2 -b v0.6.2 && mkdir Build && cd ./Build && cmake .. -DCMAKE_BUILD_TYPE=Release && make && make install && cd .. && python setup.py build && python setup.py install


WORKDIR /root/
EXPOSE 6500
