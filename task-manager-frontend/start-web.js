#!/usr/bin/env node

// Execute the Expo CLI  
process.argv = ['node', 'expo', 'start', '--web'];
require('@expo/cli');
