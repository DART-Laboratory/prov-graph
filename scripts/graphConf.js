
// configuration

//elastic search index corresponding to a particular label

const file_index = 'file_*';
const process_index = 'process_*';
const socket_index = 'socket_*';
const zeek_index = 'conn_*';
const dhcp_index = 'dhcp_*';
const dns_index = 'dns_*';
const http_index = 'http_*';
const ssl_index = 'ssl_*';
const networkfile_index ='files_*';

// link to elastic search on port 9200
//for attack
const es_file_index_url = 'http://localhost:9200/'.concat(file_index.concat('/_doc/_search'));
const es_process_index_url = 'http://localhost:9200/'.concat(process_index.concat('/_doc/_search'));
const es_socket_index_url = 'http://localhost:9200/'.concat(socket_index.concat('/_doc/_search'));
const es_zeek_index_url = 'http://localhost:9200/'.concat(zeek_index.concat('/_doc/_search'));
const es_dhcp_index_url = 'http://localhost:9200/'.concat(dhcp_index.concat('/_doc/_search'));
const es_dns_index_url = 'http://localhost:9200/'.concat(dns_index.concat('/_doc/_search'));
const es_http_index_url = 'http://localhost:9200/'.concat(http_index.concat('/_doc/_search'));
const es_ssl_index_url = 'http://localhost:9200/'.concat(ssl_index.concat('/_doc/_search'));
const es_networkfile_index_url = 'http://localhost:9200/'.concat(networkfile_index.concat('/_doc/_search'));

// Graph configuration
const default_nb_of_layers = 20;// the number of layers after which the first layer vanishes
const node_limit_per_request = 60;//how much nodes are coming from es per request
const node_visible_per_request_limit = 100;//how many nodes are visible per request

// Simulation
const force_strength = -900;//electrostatic charge between nodes (repulsion if begative)
const link_strength = 0.4;//pushes linked nodes further or apart
//positioning force towards the axis
const force_x_strength = 0.05;
const force_y_strength = 0.05;

// Nodes
const default_node_size = 10;
const default_stroke_width = 1;
const default_node_color = "#80E810";
const active_node_margin = 6;
const active_node_margin_opacity = 0.3;
//initial position
var search_fx = 210;//position of the very first node(s)
var dist_x = 150;// initial distance between active node and its new neighbours
var next_free_position = 50; //incremented value to find the next free position for nodes to prevent overlap

// Edges
const default_edge_stroke_width = 3;
const default_edge_color = "#959595";
const edge_label_color = "#111";
const use_curved_edges = false;

// system files (if you want to exclude them out)

const system_files=["so","lib","null","Not Found"]