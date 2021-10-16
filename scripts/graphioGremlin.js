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


var node_history = {};
var node_position_list=[];
//unique id for edge
var edge_id=0;
var node_position_history=[]
var merge_node_history=[]
var merge_node_dict={}



//hash function used for merging similar nodes
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



var graphioGremlin = (function(){
	


	function search_query() {
		// Query sent to the server when clicking the search button
		//
		// Preprocess query



let input_field = $('#search_field').val();
$('#outputArea').html('ZEEK-AGENT Visualizer');
$('#messageArea').html('ZEEK-AGENT Visualizer');
let input_id = $('#search_value').val();

let label_field = $('#label_field').val();



if (input_field=="ID"){
// form a query to find the id from elasticsearch database
var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "_id":input_id
            
          }
          // if you want to add another field in the query, you can do so by uncommenting and adding relevant field
        // },
        // {
        //   "match": {
        //     //"id.resp_p":port_num
        


        //   }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}
if (label_field=='none' || label_field=='process'){//fetch the node matching the id if it exists in process index
$.ajax({
            
            url: es_process_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                //console.log("data",data)
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,"process")
                var test_dic={'nodes':data_list,'links':[]}
								//console.log("graphnew",test_dic)
								graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
                           
            }})
}
if (label_field=='none' || label_field=='file'){//fetch the node matching the id if it exists in process file
$.ajax({
            
            url: es_file_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,"file")
                var test_dic={'nodes':data_list,'links':[]}
                                //console.log("graphnew",test_dic)
                                graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
              
             
            }})

}
if (label_field=='none' || label_field=='socket'){//fetch the node matching the id if it exists in process socket
$.ajax({
            
            url: es_socket_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                //console.log("data",data)
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,"socket")
                var test_dic={'nodes':data_list,'links':[]}
                                //console.log("graphnew",test_dic)
                                graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
              
             
            }})
}
if (label_field=='none' || label_field=='zeek'){ //fetch the node matching the id if it exists in process zeek
$.ajax({
            
            url: es_zeek_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                //console.log("data",data)
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,"conn")
                var test_dic={'nodes':data_list,'links':[]}
                                //console.log("graphnew",test_dic)
                                graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
              
             
            }})
}

}

if (input_field=="PID" && (label_field=='none' || label_field=='process')){//fetch process node with a certain pid

input_id=parseInt(input_id)
var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "pid":input_id
            
          }
        
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_process_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,"process")
                var test_dic={'nodes':data_list,'links':[]}
                                //console.log("graphnew",test_dic)
                                graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
              
             
            }})


    }





    if (input_field=="FILE NAME" && (label_field=='none' || label_field=='file')) {//fetch file node with a certain file name


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "path":input_id
          }
        
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_file_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,"file")
                var test_dic={'nodes':data_list,'links':[]}
                                //console.log("graphnew",test_dic)
                                graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
              
             
            }})


    }



    if (input_id=="" && label_field!="none")// search and fetch all nodes belonging to a certain label
    {
        var label_url=""
        var label_node=""
        if (label_field=="process")
        {
            label_url=es_process_index_url
            label_node="process"
        }
        if (label_field=="file")
        {
            label_url=es_file_index_url
            label_node="file"
        }
        if (label_field=="socket")
        {
            label_url=es_socket_index_url
            label_node="socket"
        }
        if (label_field=="zeek")
        {
            label_url=es_zeek_index_url
            label_node="conn"
        }


        var data={
                    "query" : {
                        "match_all" : {}
                    }
                    ,
                    "size":node_limit_per_request
                }


        $.ajax({
           
            url: label_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                var data_list=data_manipulation(data,search_fx,label_node)
                var test_dic={'nodes':data_list,'links':[]}
                                
                                graph_viz.refresh_data(test_dic,1,null)
                                node_position_list.push(search_fx)
                                search_fx=search_fx+25
              }
              
             
            }})


    }



	}

	///////////////////////////////////////////////////////data manipulation of nodes, specified structure for front end////////////////////////////////////////////////
function data_manipulation(data,val,type)
{
	
	var data_list=[]
	
	for (var key in data)
	{
		

		var data_dict=data[key];
		
		data_dict["id"]=data_dict['_id']
		data_dict["properties"]=data_dict["_source"]
		
		data_dict['type']='vertex'
		delete data_dict['_index']
		delete data_dict['_type']
		delete data_dict['_source']
		delete data_dict['_score']
		delete data_dict['_id']
		
		if (type=="process")
		{
		
        data_dict["properties"]['name']=data_dict["properties"]['exe']
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

		
		var ts=data_dict['properties']['ts']
		var host_ts=data_dict['properties']['host_ts']
		var dict_for_hash = JSON.parse(JSON.stringify(data_dict['properties']));
		if (data_dict['label']!="ZEEK" && data_dict['label']!="NETWORK")
		{
		delete dict_for_hash['host_ts']
	}

		delete dict_for_hash['ts']
		
		var hash=MD5(JSON.stringify(dict_for_hash))//merging of similar nodes

		if (merge_node_history.includes(hash) )
		{
			
			if(!data_list.includes(merge_node_dict[hash]))
			{
			data_list.push(merge_node_dict[hash])
		}
			
			var x=2
		}
		else
		{
			merge_node_history.push(hash)


		for (var key2 in data_dict['properties'] )
		{
			
			data_dict['properties'][key2]=[{'id':1,'value':data_dict['properties'][key2],"label":key2}]
			
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
    
	return data_list;
	
}
/////////edge manipulation to form correct structure for frontend

function edge_manipulation_process_process(data,curr_node,inorout,from,to)

{
	var edge_list=[]
	for (var key in data)
	{
		var curr_edge_dict={}
		
		var curr_data=data[key]
		
			curr_edge_dict.id=edge_id
			edge_id=edge_id+1
			if (from=="process" && to=="process" && inorout=="outbound")
			{
			curr_edge_dict.label=curr_data.properties.syscall[0].value
				
			}
            if (from=="process" && to=="process" && inorout=="inbound")
            {
            curr_edge_dict.label=curr_node.properties.syscall[0].value
                
            }
			if (from=="process" && to=="file")
			{
				
			curr_edge_dict.label=curr_data.properties.syscall[0].value
			}
			if (from=="process" && to=="socket")
			{
				
			curr_edge_dict.label=curr_data.properties.syscall[0].value
			}
			if (from=="socket" && to=="conn")
			{
				
			curr_edge_dict.label='CORRELATION'
			}
            if (from=="conn" && to=="socket")
            {
                
            curr_edge_dict.label='CORRELATION'
            }
            if (from=="conn" && to=="dns")
            {
                
            curr_edge_dict.label='network'
            }
            if (from=="conn" && to=="dhcp")
            {
                
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
			
			if (inorout=="inbound")
		{
			curr_edge_dict.source=curr_data
			curr_edge_dict.target=curr_node
			
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
	
	if (node_position_history.includes(id))
	{
		
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
				position=position+next_free_position;
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
				position=position-next_free_position;
				found_free=true;
			}
		}
	}






	}


	function click_query(d) {
		

var combined_nodes=[]
var combined_edges=[]

if (d.label=="PROCESS")
{


var ppid_process=d.properties.ppid[0].value

var node_pos=d.fx-dist_x
var node_pos=find_node_position(node_pos,"backward",d.id)
//find parent process

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
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_process_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","process","process")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})

node_position_list.push(node_pos)

//////find  child pid process
var pid_process=d.properties.pid[0].value

var node_pos=d.fx+dist_x

var node_pos=find_node_position(node_pos,"forward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "ppid":pid_process
          }
        }
      ]
    }
  },
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_process_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                //console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","process","process")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})





//////find files related to the process
var pid_process=d.properties.pid[0].value


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
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_file_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                //console.log("data",data)
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"file")
                	//console.log("pid data",pid_process)
                combined_nodes=combined_nodes.concat(pid_process)
                //console.log("combined_nodes",combined_nodes)
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","process","file")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})



//////find sockets related to the process
var pid_process=d.properties.pid[0].value




var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "pid":pid_process
          }
        }
      ]
    }
  }
  ,
  "size": node_limit_per_request
}

$.ajax({
            
            url: es_socket_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"socket")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","process","socket")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})



node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)

var test_dic={'nodes':combined_nodes,'links':combined_edges}

graph_viz.refresh_data(test_dic,1,d.id)


}


//////////////////////////////handle socket node//////////////////////



if (d.label=="SOCKET")
{


var seuid=d.properties.seuid[0].value

var node_pos=d.fx+dist_x
var node_pos=find_node_position(node_pos,"forward",d.id)


//////find zeek nodes attributed with the socket based on orig_seuid

var data={
  "query": {
    "match": {
      "orig_seuids": seuid 
    }
  },
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_zeek_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"conn")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","socket","conn")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})





//////find zeek nodes attributed with the socket based on resp_seuid


var data={
  "query": {
    "match": {
      "resp_seuids": seuid 
    }
  },
  "size":node_limit_per_request
}


$.ajax({
            
            url: es_zeek_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"conn")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","socket","conn")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})


node_position_list.push(node_pos)



///////find parent process related to the socket


var pid=d.properties.pid[0].value
//console.log("ppid_process",ppid_process)
var node_pos=d.fx-dist_x
var node_pos=find_node_position(node_pos,"backward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "pid":pid
          }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_process_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","socket","process")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})


node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)

var test_dic={'nodes':combined_nodes,'links':combined_edges}

graph_viz.refresh_data(test_dic,1,d.id)



}



if (d.label=="FILE")
{


///////////////find process related to the file
var pid=d.properties.pid[0].value

var node_pos=d.fx-dist_x
var node_pos=find_node_position(node_pos,"backward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "pid":pid
          }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_process_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                	var pid_process=data_manipulation(data,node_pos,"process")
                	
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","file","process")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})


node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)

var test_dic={'nodes':combined_nodes,'links':combined_edges}

graph_viz.refresh_data(test_dic,1,d.id)





}






if (d.label=="ZEEK")
{
var node_pos=d.fx-dist_x
var node_pos=find_node_position(node_pos,"backward",d.id)

///////////////find socket attributed to zeek based on orig_seuid
var uid=d.properties.uid[0].value
try{
var orig_seuid=d.properties.orig_seuids[0].value

for (var key in orig_seuid)
{
    
    var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "seuid":orig_seuid[key]
          }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_socket_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                    var pid_process=data_manipulation(data,node_pos,"socket")
                    
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","conn","socket")
                combined_edges=combined_edges.concat(edges)
              }
            
             
            }})





}
}
catch (err){
// console.log("resp",err) 
}


try{
var resp_seuid=d.properties.resp_seuids[0].value
///////////////find socket attributed to zeek based on resp_seuid
for (var key in orig_seuid)
{
    
    var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "seuid":resp_seuid[key]
          }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_socket_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                    var pid_process=data_manipulation(data,node_pos,"socket")
                    
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"inbound","conn","socket")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})





}
}
catch (err){
// console.log("resp",err)
 }




// find network nodes related to the zeek log,both dns and dhcp, any new network logs may be added here

var node_pos=d.fx+dist_x
var node_pos=find_node_position(node_pos,"forward",d.id)


var data = {
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            
            "uid":uid
          }
        }
      ]
    }
  }
  ,
  "size":node_limit_per_request
}

$.ajax({
            
            url: es_dns_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                    var pid_process=data_manipulation(data,node_pos,"dns")
                    
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","conn","dns")
                combined_edges=combined_edges.concat(edges)
              }
              
             
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
            
            url: es_dhcp_index_url,
            type: 'POST',
            
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            async:false,
            success: function(response) {
                var data = response.hits.hits;
                
                if (data.length != 0)
                {
                    var pid_process=data_manipulation(data,node_pos,"dhcp")
                    
                combined_nodes=combined_nodes.concat(pid_process)
                
                var edges=edge_manipulation_process_process(pid_process,d,"outbound","conn","dhcp")
                combined_edges=combined_edges.concat(edges)
              }
              
             
            }})


node_position_list.push(node_pos)
node_position_history.push(d.id)

combined_nodes.push(d)
//console.log("combined_edges",combined_edges)
var test_dic={'nodes':combined_nodes,'links':combined_edges}
//console.log("graphnew",test_dic)
graph_viz.refresh_data(test_dic,1,d.id)





}











	}


	

	return {
		
		search_query : search_query,
		click_query : click_query,
		
	}
})();