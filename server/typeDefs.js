const {gql} = require('apollo-server-express')

const typeDefs = gql`

  type Value{
    date: Int! 
    value: String!
  }

  type Values{
    Value: [Value]
  }

  type Data{
    resultType: String
    result:[Values]

  }
  type ResultObject{
    status: String!
    data: Data 
  }

  type Query{
    getCpuUsageSecondsTotal(start:String!, stop:String!): Data
  }
`


module.exports = typeDefs;