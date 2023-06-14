import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Footer() {
    return (
        <div className="w-full h-auto px-3 py-4 md:px-0 md:py-8 mt-16 flex flex-row justify-between items-center border-t">
            <a href='https://github.com/safwanyp/medilink' target="_blank" rel="noopener noreferrer">
                <div className="flex flex-row gap-3 font-satoshi-bold items-center cursor-pointer">
                    <BsGithub className="text-2xl"/>
                    <span className="hidden md:block text-sm md:text-base">We&apos;re open source!</span>
                    <HiOutlineExternalLink className="hidden md:block text-base -m-2"/>
                </div>
            </a>
            <span className="text-sm md:text-base">© 2023 Safwan Parkar. All rights reserved.</span>
        </div>
    );
}