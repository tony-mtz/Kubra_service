const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express')
const {RESTDataSource} = require('apollo-datasource-rest')

const PORT = 9000;

const API_URL = 'http://104.200.26.218:8080/api/v1/';

//'http://104.200.26.218:8080/api/v1/query_range?query=rate(node_network_transmit_bytes_total{job="node-exporter",instance="192.168.136.62:9100",device!="lo"}[1m])&start=2021-03-19T19:12:52.00Z&end=2021-03-22T20:12:52.00Z&step=1m'
class PrometheusAPI extends RESTDataSource{
  constructor(){
    super()
    this.baseURL = API_URL;
  }

  /**
   * Caller must provide start and end date times.  This can be done
   * by creating a new Date
   * @param {*} startDateTime 
   * @param {*} endDateTime 
   * @param {*} step //1m
   */
  async getCpuUsageSecondsTotal(startDateTime, endDateTime, step){   
    let str = 'query_range?query=sum(rate(container_cpu_usage_seconds_total{id="/"}[1m]))/sum((machine_cpu_cores)*100)&'
    str += 'start='+startDateTime +'&end='+endDateTime+'&step='+step
    // &start=2021-03-19T19:12:52Z&end=2021-03-21T20:12:52Z&step=1m')
    // const data = await this.get('query_range?query=sum(rate(container_cpu_usage_seconds_total{id="/"}[1m]))/sum((machine_cpu_cores)*100)&start=2021-03-19T19:12:52Z&end=2021-03-21T20:12:52Z&step=1m')
    const data = await this.get(str)
    let res = this.convertToObjects(data.data.result[0].values)
    console.log(res)
    return res;
  }

  /**
   * 
   * @param {*} arr 
   */
  convertToObjects(arr){
    const result = arr.map(x => {
      let dateTime = new Date(1000 *x[0]).toJSON();
      let value = x[1];
      return {dateTime, value}


    })
    return result;
  }
}

const typeDefs = gql`
  type Metric{
    dateTime: String
    value: String
  }

  type Query{
    cpuUsage(start:String!, end:String!, step:String!): [Metric]
    
  }
`

const resolvers = {
  Query:{
    cpuUsage: async(_, {start, end, step}, {dataSources})=>{
      return dataSources.prometheusAPI.getCpuUsageSecondsTotal(start, end, step)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers, 
  dataSources: ()=>{
    return{
      prometheusAPI: new PrometheusAPI()
    } 
  }
})

const app = express()
server.applyMiddleware({app});

app.listen(PORT, console.log("listening on port: ", PORT));

