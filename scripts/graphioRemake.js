import { Client } from '@elastic/elasticsearch';
const clientURL = 'http://elastic:stimulus5affect-roof@beryl.cs.virginia.edu:9200';
const client = new Client({
    node: clientURL,
});
function helloWorld()
{
    console.log("Hello ASIDNASDNIASIDASDISAUDUANSUID")
    return "Hello ASIDNASDNIASIDASDISAUDUANSUID"
}
async function search_query(vertexValue = 'x', vertexKey = '_id', vertexLabel = "None") {
    const executedQuery = {
        index: 'atlasv2-edr-h1-s4',
        body: {
            query: {
                match: {
                    [vertexKey]: vertexValue
                }
            }
        }
    };
    var response = await client.search(executedQuery);
    const data = response.hits.hits;
    //await data_manipulation2(data);
    console.log(data)
}
// var graphioRemake = (function () {
//     async function search_query(vertexValue = 'x', vertexKey = '_id', vertexLabel = "None") {
//         const executedQuery = {
//             index: 'atlasv2-edr-h1-s4',
//             body: {
//                 query: {
//                     match: {
//                         [vertexKey]: vertexValue
//                     }
//                 }
//             }
//         };
//         var response = await client.search(executedQuery);
//         const data = response.hits.hits;
//         //await data_manipulation2(data);
//         console.log(data)
//     }
//     function data_manipulation2(data) {
//         var data_list = []
//         for (var key in data) {
//             var data_dict = data[key];
//             data_dict["id"] = data_dict['_id']
//             data_dict['type'] = 'vertex'
//             delete data_dict['_index']
//             delete data_dict['_score']
//             delete data_dict['_id']
//
//
//             //var ts = data_dict['properties']['ts']
//             //var host_ts = data_dict['properties']['host_ts']
//
//
//             let limit_field = $('#limit_field').val();
//             if (limit_field == "") {
//                 limit_field = node_visible_per_request_limit;
//             } else if (limit_field < 0 || limit_field > node_visible_per_request_limit) {
//                 limit_field = node_visible_per_request_limit;
//             }
//             // removed_list=data_list.splice(limit_field)
//             // console.log(removed_list)
//             data_list = data_list.splice(0, limit_field)
//         }
//         return data_list;
//     }
//
//
//
// // Execute the query
// //     async function runQuery(query) {
// //         try {
// //             const response = await client.search(query);
// //             console.log(response.hits.hits); // currently only printing the query
// //         } catch (error) {
// //             console.error(`Error executing Elasticsearch query: ${error}`);
// //         }
// //     }
//
//     return {
//         search_query: search_query
//     }
// })();


// graphioRemake.search_query("cMLR0ooBBBvBsP_nxiN-")