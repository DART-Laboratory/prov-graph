// // // // const { Client } = require('@elastic/elasticsearch');
// // // // // Initialize the Elasticsearch client with your Elasticsearch server URL
// // // // const client = new Client({
// // // //   node: 'http://beryl.cs.virginia.edu:9200/',
// // // //     auth: {
// // // //       username: 'elastic',
// // // //       password: 'stimulus5affect-roof'
// // // //     },
// // // //   });
// // // // async function listIndices() {
// // // //   try {
// // // //     const { body } = await client.cat.indices({ format: 'json' });
// // // //     const indices = body.map(entry => entry.index);
// // // //     console.log('Indices:', indices);
// // // //   } catch (error) {
// // // //     console.error('Error fetching indices:', error);
// // // //   } finally {
// // // //     // Close the Elasticsearch client when done
// // // //     await client.close();
// // // //   }
// // // // }
// // // //
// // // // listIndices();
// // // // // Test the connection by fetching the cluster health
// // // // async function testConnection() {
// // // //   // try {
// // // //   //   const { body } = await client.cluster.health();
// // // //   //   console.log('Cluster health:', body);
// // // //   // } catch (error) {
// // // //   //   console.error('Error connecting to Elasticsearch:', error);
// // // //   // } finally {
// // // //   //   // Close the Elasticsearch client when done
// // // //   //   await client.close();
// // // //   // }
// // // //   try {
// // // //     const response = await client.cluster.health();
// // // //     if (response.statusCode === 200) {
// // // //       console.log('Cluster health:', response.body);
// // // //     } else {
// // // //       console.error('Error fetching cluster health:', response);
// // // //     }
// // // //   } catch (error) {
// // // //     console.error('Error connecting to Elasticsearch:', error);
// // // //   }
// // // //
// // // // }
// // // // // async function searchElasticsearchIndex(indexName, query) {
// // // // //   try {
// // // // //     // Perform the Elasticsearch search
// // // // //     const { body } = await client.search({
// // // // //       index: indexName,
// // // // //       body: {
// // // // //         query: {
// // // // //           match: {
// // // // //             // Searching based on _ID
// // // // //             _id: query
// // // // //           }
// // // // //         }
// // // // //       }
// // // // //     });
// // // // //
// // // // //     // Return the search results\
// // // // //     return body;
// // // // //   } catch (error) {
// // // // //     console.error(`Error searching Elasticsearch: ${error}`);
// // // // //     throw error;
// // // // //   }
// // // // // }
// // // // //
// // // // //testConnection();
// // // // //
// // // // // const indexName = 'Cadets'; // The Elasticsearch index
// // // // // const _IDSearching = '"5rmqPYkBXgE_bxsZHGMJ"'; // The desired _ID
// // // // // results = searchElasticsearchIndex(indexName, _IDSearching)
// // // // // console.log('Search Results:', results);
// // // //
// // // const { Client } = require('@elastic/elasticsearch');
// // //
// // // // Initialize the Elasticsearch client
// // // const client = new Client({
// // //   node: 'http://beryl.cs.virginia.edu:9200/',
// // //   auth: {
// // //     username: 'elastic',
// // //     password: 'stimulus5affect-roof'
// // //   },
// // // });
// // //
// // // async function listIndices() {
// // //   try {
// // //     const { body } = await client.cat.indices({ format: 'json' });
// // //     const indices = body.map(entry => entry.index);
// // //     console.log('Indices:', indices);
// // //   } catch (error) {
// // //     console.error('Error fetching indices:', error);
// // //   } finally {
// // //     // Close the Elasticsearch client when done
// // //     await client.close();
// // //   }
// // // }
// // //
// // // listIndices();
// // const { Client } = require('@elastic/elasticsearch');
// //
// // // Initialize the Elasticsearch client
// // const client = new Client({
// //   node: 'http://beryl.cs.virginia.edu:9200/',
// //   auth: {
// //     username: 'elastic',
// //     password: 'stimulus5affect-roof'
// //   },
// // });
// //
// // async function listIndices() {
// //   try {
// //     const { body } = await client.cat.indices({ format: 'json' });
// //
// //     // The response is an array of objects, so you can directly map the index names
// //     const indices = body.map(entry => entry.index);
// //
// //     console.log('Indices:', indices);
// //   } catch (error) {
// //     console.error('Error fetching indices:', error);
// //
// //   } finally {
// //     // Close the Elasticsearch client when done
// //     await client.close();
// //   }
// // }
// //
// // listIndices();
//
// const { Client } = require('@elastic/elasticsearch');
//
// // Initialize the Elasticsearch client
// const client = new Client({
//   node: 'http://beryl.cs.virginia.edu:9200/',
//   auth: {
//     username: 'elastic',
//     password: 'stimulus5affect-roof'
//   },
// });
//
// async function listIndices() {
//   try {
//     const { body } = await client.cat.indices({ format: 'json' });
//
//     if (Array.isArray(body)) {
//       // The response is an array of objects, so you can directly map the index names
//       const indices = body.map(entry => entry.index);
//
//       console.log('Indices:', indices);
//     } else {
//       console.error('Unexpected response format:', body);
//     }
//   } catch (error) {
//     console.error('Error fetching indices:', error);
//   } finally {
//     // Close the Elasticsearch client when done
//     await client.close();
//   }
// }
//
// listIndices();
const { Client } = require('@elastic/elasticsearch');

// Initialize the Elasticsearch client

const client = new Client({
  node: 'http://elastic:stimulus5affect-roof@beryl.cs.virginia.edu:9200',
});

async function listIndices () {
  let isConnected = false
  while (!isConnected) {
   console.log('Connecting to ES')
   try {
    const health = await client.cluster.health({})
    console.log(health)
    const indices = await client.cat.indices();
    console.log(indices);
    isConnected = true
   } catch (err) {
    console.log('Connection Failed, Retrying...', err)
   }
  }
 }

// listIndices();

listIndices();
