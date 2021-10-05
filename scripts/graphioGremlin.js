/*
Copyright 2017 Benjamin RICAUD

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Interface between the visualization and the Gremlin server.
// import MD5 from "crypto-js/md5";
// console.log("hash",MD5("Message").toString());
//var md5=require("md5");

//console.log("hash",CryptoJS.MD5("Message"));

var traversal_source = getUrlParameter('ts');
var node_history = {};
var node_position_list=[];
//unique id for edge
var edge_id=0;
var node_position_history=[]
var merge_node_history=[]
var merge_node_dict={}
//var elasticsearch = require('elasticsearch');

// var client = new elasticsearch.Client({
//       host: 'localhost:9200'
//   });
// var endpoint = 'http://localhost:9200/conn_index/_doc';
// var table = ES.Table(endpoint);


var MD5 = function (string) {

 


    function RotateLeft(lValue, iShiftBits) {


        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));


    }

 


    function AddUnsigned(lX,lY) {


        var lX4,lY4,lX8,lY8,lResult;


        lX8 = (lX & 0x80000000);


        lY8 = (lY & 0x80000000);


        lX4 = (lX & 0x40000000);


        lY4 = (lY & 0x40000000);


        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);


        if (lX4 & lY4) {


            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);


        }


        if (lX4 | lY4) {


            if (lResult & 0x40000000) {


                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);


            } else {


                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);


            }


        } else {


            return (lResult ^ lX8 ^ lY8);


        }


     }

 


     function F(x,y,z) { return (x & y) | ((~x) & z); }


     function G(x,y,z) { return (x & z) | (y & (~z)); }


     function H(x,y,z) { return (x ^ y ^ z); }


    function I(x,y,z) { return (y ^ (x | (~z))); }

 


    function FF(a,b,c,d,x,s,ac) {


        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));


        return AddUnsigned(RotateLeft(a, s), b);


    };

 


    function GG(a,b,c,d,x,s,ac) {


        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));


        return AddUnsigned(RotateLeft(a, s), b);


    };

 


    function HH(a,b,c,d,x,s,ac) {


        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));


        return AddUnsigned(RotateLeft(a, s), b);


    };

 


    function II(a,b,c,d,x,s,ac) {


        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));


        return AddUnsigned(RotateLeft(a, s), b);


    };

 


    function ConvertToWordArray(string) {


        var lWordCount;


        var lMessageLength = string.length;


        var lNumberOfWords_temp1=lMessageLength + 8;


        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;


        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;


        var lWordArray=Array(lNumberOfWords-1);


        var lBytePosition = 0;


        var lByteCount = 0;


        while ( lByteCount < lMessageLength ) {


            lWordCount = (lByteCount-(lByteCount % 4))/4;


            lBytePosition = (lByteCount % 4)*8;


            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));


            lByteCount++;


        }


        lWordCount = (lByteCount-(lByteCount % 4))/4;


        lBytePosition = (lByteCount % 4)*8;


        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);


        lWordArray[lNumberOfWords-2] = lMessageLength<<3;


        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;


        return lWordArray;


    };

 


    function WordToHex(lValue) {


        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;


        for (lCount = 0;lCount<=3;lCount++) {


            lByte = (lValue>>>(lCount*8)) & 255;


            WordToHexValue_temp = "0" + lByte.toString(16);


            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);


        }


        return WordToHexValue;


    };

 


    function Utf8Encode(string) {


        string = string.replace(/\r\n/g,"\n");


        var utftext = "";

 


        for (var n = 0; n < string.length; n++) {

 


            var c = string.charCodeAt(n);

 


            if (c < 128) {


                utftext += String.fromCharCode(c);


            }


            else if((c > 127) && (c < 2048)) {


                utftext += String.fromCharCode((c >> 6) | 192);


                utftext += String.fromCharCode((c & 63) | 128);


            }


            else {


                utftext += String.fromCharCode((c >> 12) | 224);


                utftext += String.fromCharCode(((c >> 6) & 63) | 128);


                utftext += String.fromCharCode((c & 63) | 128);


            }

 


        }

 


        return utftext;


    };

 


    var x=Array();


    var k,AA,BB,CC,DD,a,b,c,d;


    var S11=7, S12=12, S13=17, S14=22;


    var S21=5, S22=9 , S23=14, S24=20;


    var S31=4, S32=11, S33=16, S34=23;


    var S41=6, S42=10, S43=15, S44=21;

 


    string = Utf8Encode(string);

 


    x = ConvertToWordArray(string);

 


    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

 


    for (k=0;k<x.length;k+=16) {


        AA=a; BB=b; CC=c; DD=d;


        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);


        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);


        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);


        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);


        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);


        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);


        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);


        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);


        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);


        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);


        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);


        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);


        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);


        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);


        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);


        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);


        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);


        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);


        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);


        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);


        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);


        d=GG(d,a,b,c,x[k+10],S22,0x2441453);


        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);


        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);


        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);


        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);


        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);


        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);


        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);


        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);


        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);


        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);


        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);


        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);


        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);


        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);


        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);


        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);


        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);


        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);


        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);


        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);


        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);


        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);


        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);


        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);


        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);


        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);


        a=II(a,b,c,d,x[k+0], S41,0xF4292244);


        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);


        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);


        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);


        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);


        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);


        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);


        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);


        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);


        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);


        c=II(c,d,a,b,x[k+6], S43,0xA3014314);


        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);


        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);


        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);


        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);


        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);


        a=AddUnsigned(a,AA);


        b=AddUnsigned(b,BB);


        c=AddUnsigned(c,CC);


        d=AddUnsigned(d,DD);


    }

 


    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

 


    return temp.toLowerCase();

}

//console.log("hash",MD5("hahah123}"))



// if (traversal_source == null) {
// 	traversal_source = "g"
// }

var graphioGremlin = (function(){
	"use strict";
	// const scriptTag=document.createElement('script')
	// scriptTag.src='https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.12.0/js/mf5.min.js';
	// document.head.appendChild(scriptTag)
	// console.log("hash",md5('password'))

	
// 	var _node_properties = [];
// 	var _edge_properties = [];
	
// 	function get_node_history()
// 	{
// 		return node_history;
// 	}
// 	function get_node_properties(){
// 		return _node_properties;
// 	}
// 	function get_edge_properties(){
// 		return _edge_properties;
// 	}

// 	function create_single_command(query){
// 		var equalIndex = query.indexOf("=");
// 		var semiColonIndex = query.indexOf(";");
// 		if( equalIndex >= 0){
// 			if(semiColonIndex < 0){
// 				query = query.substring(equalIndex+1);
// 			} else {
// 				query = query.substring(equalIndex+1,semiColonIndex);
// 			}
// 		}
// 		var returnQuery = query.trim();
// //                        if(returnQuery.endsWith(".toList();")){
// //                            returnQuery = returnQuery+".toList();";
// //                        }
// 		return returnQuery;
// 	}


	function search_query() {
		// Query sent to the server when clicking the search button
		//
		// Preprocess query

//////////////////////////////////////////////////////////////////////////////////experiment

		// table.query({
		//   q: 'proto:tcp'
		  
		// }).done(function(out) {
		//   console.log(out,"query new");
		// });
// 		var query ='{“query”:{“match”:{“proto”:“tcp”}}}';

// $.ajax({
//         url: `http://localhost/conn_index/_doc/_search?
//               source_content_type=application/json&source=${query}`,
//         success: function(data) {
//             console.log(data);
//         }
//     });
// var data = {
//             "query":[ 
//             {
//                 "match": {
//                     "proto": "tcp"
//                 }
//             },
//             {
//                 "match": {
//                     "id.resp_p" : 22
//                 }
//             }
//             ]
//         }; 
//console.log("forces",force_x_strength)
$('#outputArea').html('ZEEK-AGENT Visualizer');
$('#messageArea').html('ZEEK-AGENT Visualizer');
let input_id = $('#search_value').val();
var port_num=22;
var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            //"pid":1471
            //"pid":20112
            //"pid":38838
            "pid":3971//for dns
            //"pid":1181
          }
        },
        {
          "match": {
            //"id.resp_p":port_num
            //"ppid":1338

            //"properties":{"resp_bytes":0}
            //"label":"process"
            //"ppid":20110
            //"ppid":38813
            "ppid":3970
            //"ppid":1//fordhcp

          }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            // url: 'http://localhost:9200/file_index/_doc/_search',
            //url: 'http://localhost:9200/file_index_attack_two/_doc/_search',
            //url: 'http://localhost:9200/process_dummy/_doc/_search',
            url: es_process_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,210,"process")
                var test_dic={'nodes':data_list,'links':[]}
								//console.log("graphnew",test_dic)
								graph_viz.refresh_data(test_dic,1,null)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

node_position_list.push(210)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////

		// //let input_string = $('#search_value').val();
		// let input_string= "89d8a0b2-5b72-402a-b50a-66f596583f53"
		// let input_field = $('#search_field').val();
		// let label_field = $('#label_field').val();
		// let limit_field = $('#limit_field').val();
		// //console.log(input_field)
		// var filtered_string = input_string;//You may add .replace(/\W+/g, ''); to refuse any character not in the alphabet
		// if (filtered_string.length>50) filtered_string = filtered_string.substring(0,50); // limit string length
		// // Translate to Gremlin query
		// let has_str = "";
		// if (label_field !== "") {
		// 	has_str = ".hasLabel('" + label_field + "')";
		// }
		// if (input_field !== "" && input_string !== "") {
		// 	has_str += ".has('" + input_field + "',";
		// 	if (isInt(input_string)){
		// 		has_str += filtered_string + ")"
		// 	} else {
		// 		has_str += "'" + filtered_string + "')"
		// 	}
		// } else if (limit_field === "" || limit_field < 0) {
		// 	limit_field = node_limit_per_request;
		// }

		// let gremlin_query_nodes = "nodes = " + traversal_source + ".V()" + has_str;
		// console.log(traversal_source.toString());
		// // Query limit
		// if (limit_field !== "" && isInt(limit_field) && limit_field > 0) {
		// 	gremlin_query_nodes += ".limit(" + limit_field + ")";
		// } else {
		// 	console.log('Warning: no node limit set for the query. The query may fail if the graph is too big.')
		// }
		// gremlin_query_nodes += ".toList();";

		// let gremlin_query_edges = "edges = " + traversal_source + ".V(nodes).aggregate('node').outE().as('edge').inV().where(within('node')).select('edge').toList();";
		// let gremlin_query_edges_no_vars = "edges = " + traversal_source + ".V()"+has_str+".aggregate('node').outE().as('edge').inV().where(within('node')).select('edge').toList();";
		// //let gremlin_query_edges_no_vars = "edges = " + traversal_source + ".V()"+has_str+".bothE();";
		// console.log(has_str,"here")
		// let gremlin_query = gremlin_query_nodes + gremlin_query_edges + "[nodes,edges]";
		// //console.log(gremlin_query);

		// // while busy, show we're doing something in the messageArea.
		// $('#messageArea').html('<h3>(loading)</h3>');
		// // To display the queries in the message area:
		// //var message_nodes = "<p>Node query: '"+gremlin_query_nodes+"'</p>";
		// //var message_edges = "<p>Edge query: '"+gremlin_query_edges+"'</p>";
		// //var message = message_nodes + message_edges;
		// var message = "";

		// send_to_server(gremlin_query,'search',null,message);

	}

	///////////////////////////////////////////////////////data node manipulation process////////////////////////////////////////////////
function data_manipulation(data,val,type)
{
	//console.log("hash",CryptoJS.MD5('password'));
	//console.log("hash",MD5("{"hahah12":"321",}"))
	var data_list=[]
	console.log("manipulation data",data)
	for (var key in data)
	{
		console.log("key",data[key])
		// console.log("hash",MD5(JSON.stringify(data_dict)))

		var data_dict=data[key];
		//var data_dict_no_ts=data_dict;

		//console.log("hash",MD5(JSON.stringify(data_dict)))
		data_dict["id"]=data_dict['_id']
		data_dict["properties"]=data_dict["_source"]
		
		data_dict['type']='vertex'
		delete data_dict['_index']
		delete data_dict['_type']
		delete data_dict['_source']
		delete data_dict['_score']
		delete data_dict['_id']
		//////////////////////////////////////////////////delete below line
		if (type=="process")
		{
		data_dict["properties"]['name']=data_dict["properties"]['pid']
		data_dict['label']="PROCESS"
		}
		if (type=="file")
		{
		data_dict["properties"]['name']=data_dict["properties"]['path']
		data_dict['label']="FILE"
		}
		if (type=="socket")
		{
		data_dict["properties"]['name']=data_dict["properties"]['exe']
		data_dict['label']="SOCKET"
		}
		if (type=="conn")
		{
		data_dict["properties"]['name']="zeek"
		data_dict['label']="ZEEK"
		}
        if (type=="dns")
        {
        data_dict["properties"]['name']="dns"
        data_dict['label']="NETWORK"
        }
        if (type=="dhcp")
        {
        data_dict["properties"]['name']="dhcp"
        data_dict['label']="NETWORK"
        }

		// var dict_for_hash= data_dict['properties']
		// delete dict_for_hash['ts']
		// delete dict_for_hash['host_ts']
		var ts=data_dict['properties']['ts']
		var host_ts=data_dict['properties']['host_ts']
		var dict_for_hash = JSON.parse(JSON.stringify(data_dict['properties']));
		if (data_dict['label']!="ZEEK" || data_dict['label']!="NETWORK")
		{
		delete dict_for_hash['host_ts']
	}
		delete dict_for_hash['ts']
		console.log('datadict',data_dict['properties'])
		//data_dict['properties']['ts']=ts
		//data_dict['properties']['host_ts']=host_ts
		console.log('datadict2',dict_for_hash)
		console.log("hash",MD5(JSON.stringify(dict_for_hash)))
		var hash=MD5(JSON.stringify(dict_for_hash))

		if (merge_node_history.includes(hash) )
		{
			
			if(!data_list.includes(merge_node_dict[hash]))
			{
			data_list.push(merge_node_dict[hash])
		}
			//console.log('merge_node',)
			var x=2
		}
		else
		{
			merge_node_history.push(hash)


		for (var key2 in data_dict['properties'] )
		{
			//console.log('property',data_dict['properties'][key2])
			data_dict['properties'][key2]=[{'id':1,'value':data_dict['properties'][key2],"label":key2}]
			console.log('data_dict',data_dict)
		}
		data_dict['fx']=val;
		data_list.push(data_dict)
		merge_node_dict[hash]=data_dict
	}
	}
    let limit_field = $('#limit_field').val();
    if (limit_field=="")
    {
        limit_field=node_visible_per_request_limit;
    }
    else if (limit_field < 0 || limit_field > node_visible_per_request_limit)
    {
        limit_field=node_visible_per_request_limit;
    }
    data_list=data_list.splice(0,limit_field)
    console.log("datalist",data_list)
	return data_list;
	
}
/////////////////////////////////////////////////////////////////////////////////edge manipulation start

function edge_manipulation_process_process(data,curr_node,inorout,from,to)

{// if conditions on labels
	console.log("newedgedata",data,curr_node,inorout)
	var edge_list=[]
	for (var key in data)
	{
		var curr_edge_dict={}
		//console.log(data[key])
		var curr_data=data[key]
		
			curr_edge_dict.id=edge_id
			edge_id=edge_id+1
			if (from=="process" && to=="process" && inorout=="outbound")
			{
			curr_edge_dict.label=curr_data.properties.syscall[0].value/////////////////////////////////////////////////////////change this but find appropriate syscall
				// if (inorout=="inbound")
				// {
				// 	curr_edge_dict.label=curr_data.
				// }
			}
            if (from=="process" && to=="process" && inorout=="inbound")
            {
            curr_edge_dict.label=curr_node.properties.syscall[0].value/////////////////////////////////////////////////////////change this but find appropriate syscall
                // if (inorout=="inbound")
                // {
                //  curr_edge_dict.label=curr_data.
                // }
            }
			if (from=="process" && to=="file")
			{
				//console.log("syscall",curr_data)
			curr_edge_dict.label=curr_data.properties.syscall[0].value
			}
			if (from=="process" && to=="socket")
			{
				//console.log("syscall",curr_data)
			curr_edge_dict.label=curr_data.properties.syscall[0].value
			}
			if (from=="socket" && to=="conn")
			{
				//console.log("syscall",curr_data)
			curr_edge_dict.label='CORRELATION'
			}
            if (from=="conn" && to=="dns")
            {
                //console.log("syscall",curr_data)
            curr_edge_dict.label='network'
            }
            if (from=="conn" && to=="dhcp")
            {
                //console.log("syscall",curr_data)
            curr_edge_dict.label='network'
            }
			if (from=="file" && to=="process")
			{
				curr_edge_dict.label=curr_node.properties.syscall[0].value
			}
			if (from=="socket" && to=="process")
			{
				curr_edge_dict.label=curr_node.properties.syscall[0].value
			}


			curr_edge_dict.type='edge'
			curr_edge_dict.properies={'working':['yes']}
			// curr_edge_dict.index=edge_id
			// curr_edge_dict.linknum=edge_id
			if (inorout=="inbound")
		{
			curr_edge_dict.source=curr_data
			curr_edge_dict.target=curr_node
			//curr_edge_dict.label=curr_data.syscall
		}
		else
		{
			curr_edge_dict.source=curr_node
			curr_edge_dict.target=curr_data
		}
		edge_list.push(curr_edge_dict)
	}
	return edge_list
}




////////////////////finding right node position////////////
function find_node_position(position,direction,id)

{
	console.log("nodeposition",node_position_history)
	if (node_position_history.includes(id))
	{
		//console.log("nodeposition",node_position_history)
		//console.log("nodeposition2",id)
		return position;
	}
	
		if (direction=="forward"){
		var found_free=true;
		while (found_free)
		{
			if (node_position_list.includes(position))
			{
				found_free=false;
			}
			if (found_free)
			{
				return position;
			}
			else
			{
				position=position+25;
				found_free=true;
			}
		}
	}
	if (direction=="backward"){
		var found_free=true;
		while (found_free)
		{
			if (node_position_list.includes(position))
			{
				found_free=false;
			}
			if (found_free)
			{
				return position;
			}
			else
			{
				position=position-25;
				found_free=true;
			}
		}
	}




	// 		for (var i in node_history)
	// 		{
	// 			if (position==node_history[i])
	// 				found_free=false;
	// 		}
	// 		if (found_free)
	// 		{
	// 			return position;
	// 		}
	// 		else
	// 		{
	// 			position=position+25;
	// 			found_free=true;
	// 		}
	// 	}
	// }
	// if (direction=="backward"){
	// 	console.log("backward called")
	// 	var found_free=true;
	// 	while (found_free)
	// 	{
	// 		for (var i in node_history)
	// 		{
	// 			if (position==node_history[i])
	// 				found_free=false;
	// 		}
	// 		if (found_free)
	// 		{
	// 			return position;
	// 		}
	// 		else
	// 		{
	// 			console.log("backward called change")
	// 			position=position-25;
	// 			found_free=true;
	// 		}
	// 	}
	// }

	}

//////////////////////////////////////////////////////////////////////
	// function isInt(value) {
	// 	return !isNaN(value) &&
	// 		parseInt(Number(value)) == value &&
	// 		!isNaN(parseInt(value, 10));
	// }
	function click_query(d) {
		// Query sent to the server when a node is clicked
		//
		console.log("NODE CLICKED",d)

var combined_nodes=[]
var combined_edges=[]

if (d.label=="PROCESS")///////////////////////////////////////////////////////////////////////correct this later to process
{

//////find ppid process
var ppid_process=d.properties.ppid[0].value
console.log("ppid_process",ppid_process)
var node_pos=d.fx-100
var node_pos=find_node_position(node_pos,"backward",d.id)

var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "pid":ppid_process
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/process_index/_doc/_search',
            //url: 'http://localhost:9200/process_index_attack_two/_doc/_search',
            //url: 'http://localhost:9200/process_dummy/_doc/_search',
            url: es_process_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","process","process")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})

node_position_list.push(node_pos)
//node_position_history.push(d.id)
///////////////////////
//////find  child pid process
var pid_process=d.properties.pid[0].value
//console.log("ppid_process",ppid_process)
var node_pos=d.fx+100

var node_pos=find_node_position(node_pos,"forward",d.id)
//node_position_list.push()

var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "ppid":pid_process
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  },
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/process_index_attack_two/_doc/_search',
            //url: 'http://localhost:9200/process_dummy/_doc/_search',
            url: es_process_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","process","process")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})





//////find  child file of process
var pid_process=d.properties.pid[0].value
//console.log("ppid_process",ppid_process)
//var node_pos=d.fx+100

var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "pid":pid_process
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/file_index/_doc/_search',
            //url: 'http://localhost:9200/file_index_attack_two/_doc/_search',
            url: es_file_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"file")
                	console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","process","file")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})



//////find  child socket of process
var pid_process=d.properties.pid[0].value
//console.log("ppid_process",ppid_process)
//var node_pos=d.fx+100



var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "pid":pid_process
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  }
  ,
  "size": node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/socket_index/_doc/_search',
            //url: 'http://localhost:9200/socket_index_attack_two/_doc/_search',
            url: es_socket_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"socket")
                	//console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","process","socket")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})



node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)
console.log("combined_edges",combined_edges)
var test_dic={'nodes':combined_nodes,'links':combined_edges}
console.log("graphnew",test_dic)
graph_viz.refresh_data(test_dic,1,d.id)


}


//////////////////////////////handle socket node//////////////////////



if (d.label=="SOCKET")///////////////////////////////////////////////////////////////////////correct this later to process
{

//////find conn socket
var seuid=d.properties.seuid[0].value
console.log("seuid_process",[seuid])
var node_pos=d.fx+100
var node_pos=find_node_position(node_pos,"forward",d.id)


// var data = {
//   "query": {
//     "bool": {
//       "must": [
//         {
//           "match": {
//             //"proto": "tcp"
//             //"_id":input_id
//             "orig_seuids":[seuid]
//           }
//         }//,
//         // {
//         //   "match": {
//         //     //"id.resp_p":port_num
//         //     "ppid":20120

//         //     //"properties":{"resp_bytes":0}
//         //     //"label":"process"

//         //   }
//         // }
//       ]
//     }
//   }
//   ,
//   "size":node_limit_per_request
// }

var data={
  "query": {
    "match": {
      "orig_seuids": seuid 
    }
  },
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/conn_indexa/_doc/_search',
            url: es_zeek_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"conn")
                	//console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","socket","conn")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})







// var data = {
//   "query": {
//     "bool": {
//       "must": [
//         {
//           "match": {
//             //"proto": "tcp"
//             //"_id":input_id
//             "resp_seuids":[seuid]
//             //"resp_l2_addr":"33:33:00:00:00:fb"
//           }
//         }//,
//         // {
//         //   "match": {
//         //     //"id.resp_p":port_num
//         //     "ppid":20120

//         //     //"properties":{"resp_bytes":0}
//         //     //"label":"process"

//         //   }
//         // }
//       ]
//     }
//   }
//   ,
//   "size":node_limit_per_request
// }
var data={
  "query": {
    "match": {
      "resp_seuids": seuid 
    }
  },
  "size":node_limit_per_request
}


$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/conn_indexa/_doc/_search',
            url: es_zeek_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"conn")
                	//console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","socket","conn")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})


node_position_list.push(node_pos)
//node_position_history.push(d.id)


///////////////////////////////////////////////find parent process of the socket


var pid=d.properties.pid[0].value
//console.log("ppid_process",ppid_process)
var node_pos=d.fx-100
var node_pos=find_node_position(node_pos,"backward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "pid":pid
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/process_index/_doc/_search',
            //url: 'http://localhost:9200/process_index_attack_two/_doc/_search',
            url: es_process_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	//console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","socket","process")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})


node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)
console.log("combined_edges",combined_edges)
var test_dic={'nodes':combined_nodes,'links':combined_edges}
console.log("graphnew",test_dic)
graph_viz.refresh_data(test_dic,1,d.id)



}



if (d.label=="FILE")
{


///////////////handle parent process of file
var pid=d.properties.pid[0].value
//console.log("ppid_process",ppid_process)
var node_pos=d.fx-100
var node_pos=find_node_position(node_pos,"backward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "pid":pid
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/process_index/_doc/_search',
            //url: 'http://localhost:9200/process_index_attack_two/_doc/_search',
            url: es_process_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	//console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","file","process")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
              	console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
													//     console.log(key + ":" + value)
													// }
            }})


node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)
console.log("combined_edges",combined_edges)
var test_dic={'nodes':combined_nodes,'links':combined_edges}
console.log("graphnew",test_dic)
graph_viz.refresh_data(test_dic,1,d.id)





}






if (d.label=="ZEEK")
{


///////////////handle parent process of file
var uid=d.properties.uid[0].value
//console.log("ppid_process",ppid_process)
var node_pos=d.fx+100
var node_pos=find_node_position(node_pos,"forward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            //"proto": "tcp"
            //"_id":input_id
            "uid":uid
          }
        }//,
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        //     "ppid":20120

        //     //"properties":{"resp_bytes":0}
        //     //"label":"process"

        //   }
        // }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/process_index/_doc/_search',
            //url: 'http://localhost:9200/process_index_attack_two/_doc/_search',
            url: es_dns_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                    var pid_process=data_manipulation(data,node_pos,"dns")
                    //console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","conn","dns")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
                console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
                                                    //     console.log(key + ":" + value)
                                                    // }
            }})



var data={
  "query": {
    "match": {
      "uids": uid
    }
  },
  "size":node_limit_per_request
}

$.ajax({
            //url: 'http://localhost:9200/conn_indexxxx/_doc/_search',
            //url: 'http://localhost:9200/conn_indexa/_doc/_search',
            url: es_dhcp_index_url,
            type: 'POST',
            //contentType: 'application/json; charset=UTF-8',
            //accept: "application/json",
            //crossDomain: true,
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                console.log("data",data)
                if (data.length != 0)
                {
                    var pid_process=data_manipulation(data,node_pos,"dhcp")
                    //console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","conn","dhcp")
                combined_edges=combined_edges.concat(edges)
              }
              else
              {
                console.log("invalid id")
              }
             //    for (const [key, value] of Object.entries(data)) {
                                                    //     console.log(key + ":" + value)
                                                    // }
            }})


node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)
console.log("combined_edges",combined_edges)
var test_dic={'nodes':combined_nodes,'links':combined_edges}
console.log("graphnew",test_dic)
graph_viz.refresh_data(test_dic,1,d.id)





}









	// 	var edge_filter = $('#edge_filter').val();
	// 	var communication_method = SERVER_COMMUNICATION_METHOD;
	// 	var id = d.id;
	// 	if (typeof id === 'string' || id instanceof String) { // Add quotes if id is a string (not a number).
	// 		id = '"'+id+'"';
	// 	}
	// 	// Gremlin query
	// 	var gremlin_query_nodes = 'nodes = ' + traversal_source + '.V('+id+').as("node").both('+(edge_filter?'"'+edge_filter+'"':'')+').as("node").select(all,"node").unfold()'

	// 	gremlin_query_nodes += '.fold().inject(' + traversal_source + '.V(' + id + ')).unfold()';

	// 	//var gremlin_query_nodes = 'nodes = ' + traversal_source + '.V('+id+').as("node").both('+(edge_filter?'"'+edge_filter+'"':'')+').as("node").select(all,"node").unfold().valueMap()'
	// 	//gremlin_query_nodes += 'fold().inject(' + traversal_source + '.V('+id+').valueMap()).unfold()'

	// 	// 'inject' is necessary in case of an isolated node ('both' would lead to an empty answer)
	// 	//console.log('Query for the node and its neigbhors')

	// 	var gremlin_query_edges = "edges = " + traversal_source + ".V("+id+").bothE("+(edge_filter?"'"+edge_filter+"'":"")+")";
	// 	var gremlin_query = gremlin_query_nodes+'\n'+gremlin_query_edges+'\n'+'[nodes.toList(),edges.toList()]';
	// 	//console.log(gremlin_query);
	// 	// while busy, show we're doing something in the messageArea.
	// 	$('#messageArea').html('<h3>(loading)</h3>');
	// 	var message = "<p>Query ID: "+ d.id +"</p>"
	// 	if(SINGLE_COMMANDS_AND_NO_VARS){
	// 		var nodeQuery = create_single_command(gremlin_query_nodes);
	// 		var edgeQuery = create_single_command(gremlin_query_edges);
	// 		send_to_server(nodeQuery, null, null, null, function(nodeData){
	// 			send_to_server(edgeQuery, null, null, null, function(edgeData){
	// 				var combinedData = [nodeData,edgeData];
	// 				handle_server_answer(combinedData, 'click', d.id, message);
	// 			});
	// 		});
	// 	} else {
	// 		send_to_server(gremlin_query,'click',d.id,message);
	// 	}
	// }

	// function send_to_server(gremlin_query,query_type,active_node,message, callback){

	// 	let server_address = SERVER_ADDRESS;
	// 	let server_port = SERVER_PORT;

	// 	let server_url = "ws://"+server_address+":"+server_port+"/gremlin";
	// 	run_websocket_request(gremlin_query,server_url,query_type,active_node,message,callback);

	}


	//////////////////////////////////////////////////////////////////////////////////////////////////////
	// Websocket connection
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	// function run_websocket_request(gremlin_query,server_url,query_type,active_node,message,callback){
	// 	$('#messageArea').html('<h3>(loading)</h3>');

	// 	var msg = { "requestId": uuidv4(),
	// 		"op":"eval",
	// 		"processor":"",
	// 		"args":{"gremlin": gremlin_query,
	// 			"bindings":{},
	// 			"language":"gremlin-groovy"}}

	// 	var data = JSON.stringify(msg);

	// 	var ws = new WebSocket(server_url);
	// 	ws.onopen = function (event){
	// 		ws.send(data,{ mask: true});
	// 	};
	// 	ws.onerror = function (err){
	// 		console.log('Connection error using websocket');
	// 		console.log(err);
	// 		if (query_type == 'editGraph'){
	// 			$('#outputArea').html("<p> Connection error using websocket</p>"
	// 				+"<p> Problem accessing "+server_url+ " </p>"+
	// 				"<p> Possible cause: creating a edge with bad node ids "+
	// 				"(linking nodes not existing in the DB). </p>");
	// 			$('#messageArea').html('');
	// 		} else {$('#outputArea').html("<p> Connection error using websocket</p>"
	// 			+"<p> Cannot connect to "+server_url+ " </p>");
	// 			$('#messageArea').html('');
	// 		}

	// 	};
	// 	ws.onmessage = function (event){
	// 		//console.log(event.data,"event data")
	// 		var response = JSON.parse(event.data);
	// 		var code=Number(response.status.code)
	// 		if(!isInt(code) || code<200 || code>299) {
	// 			$('#outputArea').html(response.status.message);
	// 			$('#messageArea').html("Error retrieving data");
	// 			return 1;
	// 		}
	// 		var data = response.result.data;
	// 		if (data == null){
	// 			if (query_type == 'editGraph'){
	// 				$('#outputArea').html(response.status.message);
	// 				$('#messageArea').html('Could not write data to DB.' +
	// 					"<p> Possible cause: creating a edge with bad node ids "+
	// 					"(linking nodes not existing in the DB). </p>");
	// 				return 1;
	// 			} else {
	// 				//$('#outputArea').html(response.status.message);
	// 				//$('#messageArea').html('Server error. No data.');
	// 				//return 1;
	// 			}
	// 		}
	// 		//console.log(data)
	// 		//console.log("Results received")
	// 		if(callback){
	// 			callback(data);
	// 		} else {
	// 			handle_server_answer(data,query_type,active_node,message);
	// 		}
	// 	};
	// }

	// // Generate uuid for websocket requestId. Code found here:
	// // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	// function uuidv4() {
	// 	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	// 		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	// 		return v.toString(16);
	// 	});
	// }

	// //////////////////////////////////////////////////////////////////////////////////////////////////
	// function handle_server_answer(data,query_type,active_node,message){

	// 	//console.log(data)
	// 	data = graphson3to1(data);
	// 	var arrange_data = arrange_datav3;

	// 	if (!(0 in data)) {
	// 		message = 'No data. Check the communication protocol. (Try changing Gremlin version to 3.3.*).'
	// 		console.log(message)
	// 		$('#outputArea').html(message);
	// 		$('#messageArea').html('');

	// 	}
	// 	console.log("handleserver",data)
	// 	//console.log(center_f);
	// 	var graph = arrange_data(data, center_f, active_node);
	// 	//console.log(query_type)
	// 	if (query_type=='click') var center_f = 1; //center_f=0 mean no attraction to the center for the nodes
	// 	else if (query_type=='search') var center_f = 1;
	// 	else return;
	// 	//console.log("testhis",node_history)
	// 	//console.log(graph,"graph")
	// 	console.log('active_node',graph);
	// 	//graph_viz.refresh_data(graph,center_f,active_node);

	// 	$('#outputArea').html(message);
	// 	$('#messageArea').html('AHHHHHHHHAHAAHHA');
	// }



	// ///////////////////////////////////////////////////
	// function idIndex(list,elem) {
	// 	// find the element in list with id equal to elem
	// 	// return its index or null if there is no
	// 	for (var i=0;i<list.length;i++) {
	// 		if (list[i].id === elem) return i;
	// 	}
	// 	return null;
	// }


	// function arrange_datav3(data, center_f, active_node) {
	// 	// Extract node and edges from the data returned for 'search' and 'click' request
	// 	// Create the graph object
	// 	console.log(data,"arrangedata")
	// 	var nodes=[], links=[];
	// 	if(data!=null) {
	// 		for (var key in data){
	// 			if(data[key]!=null) {
	// 				data[key].forEach(function (item) {
	// 					if (!("inV" in item) && idIndex(nodes,item.id) == null){ // if vertex and not already in the list
	// 						item.type = "vertex";
	// 						nodes.push(extract_infov3(item, center_f, active_node));
	// 					}
	// 					if (("inV" in item) && idIndex(links,item.id) == null){
	// 						item.type = "edge";
	// 						console.log("edgeschecker",item)
	// 						links.push(extract_infov3(item, center_f, active_node));
							
	// 					}
	// 				});
	// 			}
	// 		}
	// 	}
	// 	// for (var i in links)
	// 	// 					{
	// 	// 						console.log("imp info", links[i].id,links[i].source,links[i].target)
	// 	// 						if (links[i].target==2386)
	// 	// 						{
	// 	// 							for (var j in nodes)
	// 	// 							{
	// 	// 								if (nodes[j].id ==2386)
	// 	// 								{
	// 	// 									nodes[j].fx=200;
	// 	// 								}
	// 	// 							}

	// 	// 						}
	// 	// 					}
	// 	var active_node_position=node_history[active_node];
	// 	for (var i in links)
	// 	{
	// 		for (var j in nodes)
	// 		{
	// 			if (nodes[j].id == links[i].source)
	// 			{
	// 				if (nodes[j].fx > active_node_position && nodes[j].id != active_node && !(nodes[j].id in node_history))
	// 				{
	// 					if (active_node==2262)
	// 					{
	// 					console.log("plscheck",nodes[j].fx,active_node_position,nodes[j].id) 
	// 					//console.log()
	// 				}

	// 					nodes[j].fx =active_node_position-150;
	// 					nodes[j].fx =find_position(nodes[j].fx,"backward")
	// 					if (nodes[j].id in node_history)
	// 					{
	// 					node_history[nodes[j].id]=nodes[j].fx;
	// 				}
	// 				}
	// 			}
	// 		}




	// 	}
	// 	//console.log("linksfinder",links)
	// 	return {'nodes':nodes, 'links':links};
	// }

	// function find_position(position,direction)//finds a free space, inrements x value if not able to find out
	// {
	// 	if (direction=="forward"){
	// 	var found_free=true;
	// 	while (found_free)
	// 	{
	// 		for (var i in node_history)
	// 		{
	// 			if (position==node_history[i])
	// 				found_free=false;
	// 		}
	// 		if (found_free)
	// 		{
	// 			return position;
	// 		}
	// 		else
	// 		{
	// 			position=position+25;
	// 			found_free=true;
	// 		}
	// 	}
	// }
	// if (direction=="backward"){
	// 	console.log("backward called")
	// 	var found_free=true;
	// 	while (found_free)
	// 	{
	// 		for (var i in node_history)
	// 		{
	// 			if (position==node_history[i])
	// 				found_free=false;
	// 		}
	// 		if (found_free)
	// 		{
	// 			return position;
	// 		}
	// 		else
	// 		{
	// 			console.log("backward called change")
	// 			position=position-25;
	// 			found_free=true;
	// 		}
	// 	}
	// }

	// }


	// function extract_infov3(data, center_f, active_node) {
	// 	var data_dic = { id: data.id, label: data.label, type: data.type, properties: {} };
	// 	var prop_dic = {};
	// 	var node_pos_bool= true
	// 	console.log("pool",data)
	// 	prop_dic = data.properties;
	// 	//console.log(prop_dic)
	// 	for (var key2 in prop_dic) {
	// 		if (prop_dic.hasOwnProperty(key2)) {
	// 			if (data.type == 'vertex'){// Extracting the Vertexproperties (properties of properties for vertices)
	// 				var property2 = prop_dic[key2];
	// 				property2['summary'] = get_vertex_prop_in_list(prop_dic[key2]).toString();

	// 			} else {
	// 				var property2 = prop_dic[key2]['value'];
	// 			}
	// 			//property = property.toString();
	// 			//below line was initially =property2
	// 			data_dic.properties[key2] = [property2[0]];
	// 			console.log(data_dic,"exinfo")
	// 			// If  a node position is defined in the DB, the node will be positioned accordingly
	// 			// a value in fx and/or fy tells D3js to fix the position at this value in the layout
	// 			//console.log(key2)
	// 			if (key2 == node_position_x) {
	// 				if (node_pos_bool==true){
	// 				var x_pos = 10 //prop_dic[node_position_x]['0']['value'];
	// 				//var x_pos =prop_dic[node_position_x]['0']['value'];
	// 				//console.log("zafirr",center_f)
	// 				console.log("changelength",node_history)
	// 				if (center_f != 1){
	// 					d3.selectAll(".active_node").each(function(d){
	// 						if (!(d.id in node_history))
	// 						{
	// 							var x =d.id;
	// 						node_history[x]=d.x
	// 					}
	// 						//console.log("node history",node_history)
	// 						//console.log("id",d.id)
	// 						// if(d.id==active_node){
	// 						// 	x_pos = d.x;
	// 						// 	console.log("zafirr",x_pos)
	// 						// 	console.log(center_f)
	// 						// }
	// 						//console.log("lolol",node_history)
	// 						if(active_node in node_history){
	// 							// x_pos = d.x;
	// 							// console.log("zafirr",x_pos,d.id)
	// 							// console.log(center_f)
	// 						// 	if(d.id==active_node){
	// 						x_pos = node_history[active_node];
	// 						//console.log("zafirr",x_pos)
	// 						// 	console.log(center_f)
	// 						// }
	// 						}
	// 					});
	// 				}
	// 				if (!(data_dic.id in node_history) ){
	// 				data_dic.fx = x_pos + 200;
	// 				//console.log("xcid",data_dic.id,data_dic.type)
	// 				// for (var i in node_history)
	// 				// {
	// 				// 	console.log("variable",i)
	// 				// }
	// 				data_dic.fx=find_position(data_dic.fx,"forward");
	// 				node_pos_bool=false
	// 			}
	// 			else
	// 			{
	// 				data_dic.fx = node_history[data_dic.id];
	// 				// if (data_dic.fx=undefined)
	// 				// {
	// 				// 	data_dic.fx = x_pos + 200;	
	// 				// }
	// 				node_pos_bool=false
	// 			}

	// 				// if (prop_dic[node_position_x]['0']['value'] == 0){
	// 				// 	var _svg_height = +d3.select("#main").node().getBoundingClientRect().height;
	// 				// 	data_dic.fy = _svg_height / 2;
	// 				// }
	// 				//console.log(x_pos)
	// 			}
	// 		}
				
	// 			if (key2 == node_position_y) {
	// 				data_dic.fy = prop_dic[node_position_y]['0']['value'];
	// 			}
	// 		}
	// 	}

	// 	if (data.type=="edge"){
	// 		data_dic.source = data.outV;
	// 		data_dic.target = data.inV;
	// 		if (data.id !== null && typeof data.id === 'object'){
	// 			console.log('Warning the edge id is an object')
	// 			if ("relationId" in data.id){
	// 				data_dic.id = data.id.relationId;
	// 			}
	// 		}
	// 		data_dic['id']=edge_id
	// 		edge_id=edge_id+1;
	// 		data_dic['properties']={'working':['yes']}///////////////////////////////////////////////////////////////////////////////////////////////////v important above teo lines
	// 		console.log("dataedge",data_dic['id'],data_dic['linknum'])
	// 	}
	// 	//console.log("ccid",data_dic.id,data_dic.fx,data_dic.type)
	// 	//console.log("data_dicee",data_dic)
	// 	return data_dic;
	// }

	// function get_vertex_prop_in_list(vertexProperty){
	// 	var prop_value_list = [];
	// 	for (var key in vertexProperty){
	// 		//console.log(vertexprop);
	// 		prop_value_list.push(vertexProperty[key]['value']);
	// 	}
	// 	return prop_value_list;
	// }

	// function graphson3to1(data){
	// 	// Convert data from graphSON v2 format to graphSON v1
	// 	if (!(Array.isArray(data) || ((typeof data === "object") && (data !== null)) )) return data;
	// 	if ('@type' in data) {
	// 		if (data['@type']=='g:List'){
	// 			data = data['@value'];
	// 			return graphson3to1(data);
	// 		} else if (data['@type']=='g:Set'){
	// 			data = data['@value'];
	// 			return data;
	// 		} else if(data['@type']=='g:Map'){
	// 			var data_tmp = {}
	// 			for (var i=0;i<data['@value'].length;i+=2){
	// 				var data_key = data['@value'][i];
	// 				if( (typeof data_key === "object") && (data_key !== null) ) data_key = graphson3to1(data_key);
	// 				//console.log(data_key);
	// 				if (Array.isArray(data_key)) data_key = JSON.stringify(data_key).replace(/\"/g,' ');//.toString();
	// 				data_tmp[data_key] = graphson3to1(data['@value'][i+1]);
	// 			}
	// 			data = data_tmp;
	// 			return data;
	// 		} else {
	// 			data = data['@value'];
	// 			if ( (typeof data === "object") && (data !== null) ) data = graphson3to1(data);
	// 			return data;
	// 		}
	// 	} else if (Array.isArray(data) || ((typeof data === "object") && (data !== null)) ){
	// 		for (var key in data){
	// 			data[key] = graphson3to1(data[key]);
	// 		}
	// 		return data;
	// 	}
	// 	return data;
	// }

	return {
		//get_node_properties : get_node_properties,
		//get_edge_properties : get_edge_properties,
		search_query : search_query,
		click_query : click_query,
		//send_to_server : send_to_server,
		//get_node_history : get_node_history
	}
})();