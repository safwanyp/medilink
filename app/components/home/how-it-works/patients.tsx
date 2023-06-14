import Image from "next/image";
import image from "../../../../public/assets/patient-preview.png";
import Link from "next/link";

export default function PatientsProcess() {
    return (
        <div className="flex flex-row w-full h-auto gap-16 pt-10">
            <Image 
                src={image} 
                alt="Patients Dashboard on Mobile Preview" 
                height={500}
                className="hidden md:block border-2 border-shadow"
            />
            <div className="flex flex-col w-full h-full gap-6 text-dark-grey font-satoshi-med">
                <p>As a <span className="text-orange font-satoshi-bold">patient</span>, you will get access to a dashboard that comes with features like:</p>
                <ul className="list-disc list-inside">
                    <li>Viewing your medical records</li>
                    <li>Granting doctors one-time access to your details</li>
                    <li>Granting doctors the permission to update your records</li>
                    <li>and more!</li>
                </ul>
                <p>It doesn’t just stop at this. We have plans to launch many more features to make your healthcare journey worry-free!</p>
                <p>And the best part, you get all of this for absolutely free!</p>
                <p>Rest assured, your details are secure, and will <span className="font-satoshi-bold text-orange">NEVER</span> be shared with anyone. Start using <span><span className="font-satoshi-bold text-dark-grey">Medi</span><span className="font-satoshi-med text-orange-light">Link</span></span> by clicking the button below.</p>
                <button className="rounded-full outline-none bg-orange px-7 py-2 shadow-[1px_4px_0px_0px_rgba(238,151,106,1)] transition-all duration-300 hover:shadow-none hover:px-9 w-fit grid place-items-center">
                    <Link href={'/signup?mode=patient'}>
                        <span className="text-dark-grey font-cool-con text-2xl">
                            Start Now
                        </span>
                    </Link>
                </button>
            </div>
        </div>
    );
}