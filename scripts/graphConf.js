
// configuration

//elastic search index corresponding to a particular label
const file_index = 'file_index_attack_one_new_vtwo';
const process_index = 'process_index_attack_one_new_vtwo';
const socket_index = 'socket_index_attack_one_new_vtwo';
const zeek_index = 'zeek_index_attack_one_new_vtwo';
const dhcp_index = 'dhcp_index_attack_one_new_vtwo';
const dns_index = 'dns_index_attack_one_new_vtwo';
//attack motivation_first_remove
// const file_index = 'motivational_attack_file';
// const process_index = 'motivational_attack_process';
// const socket_index = 'motivational_attack_socket';
// const zeek_index = 'motivational_attack_zeek';
// const dhcp_index = 'motivational_attack_dhcp';
// const dns_index = 'motivational_attack_dns';


// const file_index = 'motivation_attack_file';
// const process_index = 'motivation_attack_process';
// const socket_index = 'motivation_attack_socket';
// const zeek_index = 'motivation_attack_zeek';
// const dhcp_index = 'motivation_attack_dhcp';
// const dns_index = 'motivation_attack_dns';
// link to elastic search on port 9200
const es_file_index_url = 'http://localhost:9200/'.concat(file_index.concat('/_doc/_search'));
const es_process_index_url = 'http://localhost:9200/'.concat(process_index.concat('/_doc/_search'));
const es_socket_index_url = 'http://localhost:9200/'.concat(socket_index.concat('/_doc/_search'));
const es_zeek_index_url = 'http://localhost:9200/'.concat(zeek_index.concat('/_doc/_search'));
const es_dhcp_index_url = 'http://localhost:9200/'.concat(dhcp_index.concat('/_doc/_search'));
const es_dns_index_url = 'http://localhost:9200/'.concat(dns_index.concat('/_doc/_search'));

// above links after concatination
//const es_file_index_url = 'http://localhost:9200/file_index_attack_one_new_vtwo/_doc/_search';
// const es_process_index_url  ='http://localhost:9200/process_index_attack_one_new_vtwo/_doc/_search';
// const es_socket_index_url='http://localhost:9200/socket_index_attack_one_new_vtwo/_doc/_search';
// const es_zeek_index_url='http://localhost:9200/zeek_index_attack_one_new_vtwo/_doc/_search';
// const es_dhcp_index_url='http://localhost:9200/dhcp_index_attack_one_new_vtwo/_doc/_search';
// const es_dns_index_url='http://localhost:9200/dns_index_attack_one_new_vtwo/_doc/_search';






// Graph configuration
const default_nb_of_layers = 20;// the number of layers after which the first layer vanishes
const node_limit_per_request = 30;//how much nodes are coming from es per request
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
