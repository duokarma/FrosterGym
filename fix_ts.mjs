import fs from 'fs';

function fixFile(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // For PublicWebsite.tsx
    if (file.includes('PublicWebsite.tsx')) {
        code = code.replace(/import\s+React,\s*\{\s*useState,\s*useEffect,\s*useRef,\s*Suspense\s*\}\s*from\s*'react';/, "import { useState, useEffect } from 'react';");
        code = code.replace(/import\s*\{\s*Play,\s*Phone,\s*MapPin,\s*Search,\s*ChevronRight,\s*Menu,\s*X,\s*Instagram,\s*Facebook,\s*Dumbbell,\s*HeartPulse,\s*ClipboardList,\s*Droplets,\s*Users,\s*Key,\s*ShowerHead,\s*Car,\s*Medal\s*\}\s*from\s*'lucide-react';/, "import { Play, Phone, MapPin, Search, ChevronRight, Menu, X, Instagram, Facebook } from 'lucide-react';");
    } 
    // For EditorialLoader.tsx
    else if (file.includes('EditorialLoader.tsx')) {
        code = code.replace(/import\s+React,\s*\{\s*useEffect,\s*useState\s*\}\s*from\s*'react';/, "import { useEffect, useState } from 'react';");
    }
    
    fs.writeFileSync(file, code);
    console.log(`Fixed ${file}`);
}

fixFile('src/pages/website/PublicWebsite.tsx');
fixFile('src/components/website/EditorialLoader.tsx');
