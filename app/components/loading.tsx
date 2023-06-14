'use client';

import { Loading } from "@nextui-org/react";

export default function LoadingIndicator() {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-cream bg-opacity-20 z-[500]">
            <Loading color="warning" type='points' size="xl" />
        </div>
    );
}