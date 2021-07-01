const gql = require('graphql-tag')
const { GraphQLWrapper } = require('@aragon/connect-thegraph')

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/1hive/honeyfarm-polygon'

const SUPPLY_QUERY = gql`
  query {
    hsfTokens {
      totalHsfClaimed,
      totalHsfHarvested,
      totalHsfBurned
    }
  }
`

exports.getCircSupply = async () => {
  const graphqlClient = new GraphQLWrapper(SUBGRAPH_URL)
  const result = await graphqlClient.performQuery(SUPPLY_QUERY)

  if (!result.data) return undefined

  const totalHsfClaimed = +result.data.hsfTokens[0].totalHsfClaimed / 1e18
  const totalHsfHarvested = +result.data.hsfTokens[0].totalHsfHarvested / 1e18
  const totalHsfBurned = +result.data.hsfTokens[0].totalHsfBurned / 1e18

  return totalHsfClaimed + totalHsfHarvested - totalHsfBurned
}
