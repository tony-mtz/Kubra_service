const resolvers = {
  Query:{
    async cpuUsage(_, _args, {dataSources}){
      dataSources.prometheusAPI.getCpuUsageSecondsTotal()
    }
  }
}

module.exports = resolvers;