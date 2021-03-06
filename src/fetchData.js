const gql = require('graphql-tag')
const { GraphQLWrapper } = require('@aragon/connect-thegraph')
const dotenv = require('dotenv')

dotenv.config()

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-polygon'

const PRICE_QUERY = gql`
  query {
    token(id: "${process.env.TOKEN_ID}") {
      symbol
      tokenDayData(first: 1, orderBy: date, orderDirection: desc) {
        priceUSD
      }
    }
  }
`

const fetchData = async () => {
  const graphqlClient = new GraphQLWrapper(SUBGRAPH_URL)
  const result = await graphqlClient.performQuery(PRICE_QUERY)

  if (!result.data) return undefined
  return result
}

exports.getTokenPrice = async () => {
  const res = await fetchData()
  const price = parseFloat(res.data.token.tokenDayData[0].priceUSD).toFixed(2)
  return price
}

exports.getTokenSymbol = async () => {
  const res = await fetchData()
  return res.data.token.symbol
}
