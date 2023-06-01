import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Footer() {
    return (
        <div className="w-full h-auto py-8 mt-16 flex flex-row justify-between border-t">
            <a href='https://github.com/safwanyp/medilink' target="_blank" rel="noopener noreferrer">
                <div className="flex flex-row gap-3 font-satoshi-bold items-center cursor-pointer">
                    <BsGithub className="text-2xl"/>
                    <span className="text-base">We&apos;re open source!</span>
                    <HiOutlineExternalLink className="text-base -m-2"/>
                </div>
            </a>
            <span className="text-base">© 2023 MediLink. All rights reserved.</span>
        </div>
    );
}