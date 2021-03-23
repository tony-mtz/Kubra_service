const {RESTDataSource} = require('apollo-datasource-rest')
// import { RESTDataSource } from 'apollo-datasource-rest';

const API_URL = 'http://104.200.26.218:8080/api/v1/query_range?query=';

module.exports = class PrometheusAPI extends RESTDataSource{
  constructor(){
    super()
    this.baseURL = API_URL;
  }

  async getCpuUsageSecondsTotal(){
    const data = await this.get('sum(rate(container_cpu_usage_seconds_total{id="/"}[1m]))/sum((machine_cpu_cores)*100)&start=2021-03-19T19:12:52.00Z&end=2021-03-21T20:12:52.00Z&step=1m')
    console.log('here is the cpu data: ', data)
    return data; //can fix data here to conver or just get correct data
  }

  // async getNetworkTransmitBytesTotal(){
  //   const data = await this.get('rate(node_network_transmit_bytes_total{job="node-exporter",instance="192.168.136.62:9100",device!="lo"}[1m])&start=2021-03-10T19:12:52.00Z&end=2021-03-21T20:12:52.00Z&step=1m')
  //   return data;
  // }

  // async getRangeData(startDate, stopDate, query){
  //   const range = 'query_range?query='
  //   const data = await this.get(range, {start: startDate, stop:stopDate})
  //   return data;
  // }
}




/*

TODO:

get any simple query to work for range
get range with start and end dates

*/