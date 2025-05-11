import React, { useState, createContext, useContext } from 'react';

// Create the Context for global state
export const GlobalStateContext = createContext();
// Custom hook to access global state
export const useGlobalState = () => useContext(GlobalStateContext);