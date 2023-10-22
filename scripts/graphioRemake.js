const { Client } = require('@elastic/elasticsearch');
const clientURL = 'http://elastic:stimulus5affect-roof@beryl.cs.virginia.edu:9200'
const client = new Client({
    node: clientURL,
});
//var graphio2 = (function () {


// Define your Elasticsearch query

    function searchQuery(vertexValue, vertexKey = "_id", vertexLabel = "None") {
        // var vertexValue =  "XcLR0ooBBBvBsP_nxiN9"//$('#search_field').val(); //Vertex Value given only support ids
        //let vertexKey = $('#search_value').val(); //Vertex Key
        //let vertexLabel = $('#label_field').val(); //Vertex Label Filter
        const exectutedQuery = {
            index: 'atlasv2-edr-h1-s4',
            body: {
                query: {
                    match: {
                        // Your query criteria
                        vertexKey: vertexValue
                    }
                }
            }
        };
        runQuery(exectutedQuery)
    }

// Execute the query
    async function runQuery(query) {
        try {
            const response = await client.search(query);
            console.log(response.hits.hits); // currently only printing the query
        } catch (error) {
            console.error(`Error executing Elasticsearch query: ${error}`);
        }
    }
    // return {search_query: search_query}
//})()
searchQuery("XcLR0ooBBBvBsP_nxiN9");
// Call the query function







