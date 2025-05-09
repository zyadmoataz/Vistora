"use client";

import { WixClientContext } from '@/context/wixContext';
import React, { useContext } from 'react'

export default function useWixClient() {
    return useContext(WixClientContext);
}
