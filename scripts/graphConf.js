
// configuration for the graph database access

// if host is set, will override default localhost server option
//const host = "some_gremlin_server"
const host = false;

const SERVER_ADDRESS='localhost';
const SERVER_PORT='8182';
const SERVER_PROTOCOL='websocket';
const SERVER_COMMUNICATION_METHOD='GraphSON3';

// For implementations like Neptune where only single commands are allowed per request
// set to true
const SINGLE_COMMANDS_AND_NO_VARS = false;
// For implementations like Neptune where communication only over https is allowed
// set to true
const REST_USE_HTTPS = false;

// Time out for the REST protocol. Increase it if the graphDB is slow.
const REST_TIMEOUT = 2000;
// TODO: configuration for the secure server

// limit number of nodes and edges to query for graph info
// (avoid overwhelming the server for large graphs)
const limit_graphinfo_request = 10000;

// Graph configuration
const default_nb_of_layers = 30;
const node_limit_per_request = 30;
const nodes_x_position_distance = 250;

// Simulation
const force_strength = -900;
const link_strength = 0.4;
const force_x_strength = 0.05; //0.05
const force_y_strength = 0.05;

// Nodes
const default_node_size = 10;
const default_stroke_width = 1;
const default_node_color = "#80E810";
const active_node_margin = 6;
const active_node_margin_opacity = 0.3;

// Node position info in the DB
// Replace by the key storing the node position inside the DB if any
const node_position_x = 'graphexpx';
const node_position_y = 'none';

// Edges
const default_edge_stroke_width = 3;
const default_edge_color = "#959595";
const edge_label_color = "#111";
// Choose between curved (true) and straight edges (false).
// If set to false, multiple edges between 2 nodes will all be straight and overlap.
const use_curved_edges = false;
