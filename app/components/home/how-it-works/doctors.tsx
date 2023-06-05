import Image from "next/image";
import image from "../../../../public/assets/doc-preview.png";
import Link from "next/link";

export default function DoctorsProcess() {
    return (
        <div className="flex flex-row w-full h-auto gap-16 pt-10">
            <div className="flex flex-col w-full h-full gap-6 text-dark-grey font-satoshi-med">
                <p>As a <span className="text-orange font-satoshi-bold">doctor</span>, you will get access to a dashboard that let’s you work with ease!</p>
                <p>In the dashboard you will be able to request access to a patient’s health-related details with the click of a button, making it easy for you to diagnose the problem and work more efficiently!</p>
                <p>Patient data is extremely sensitive, which is why you will receive one-time access to the patient’s details, upon approval.</p>
                <p>Help us make healthcare better, and start using our platform for free right now!</p>
                <button className="rounded-full outline-none bg-orange px-7 py-2 shadow-[1px_4px_0px_0px_rgba(238,151,106,1)] transition-all duration-300 hover:shadow-none hover:px-9 w-fit grid place-items-center">
                    <Link href={'/signup?mode=doctor'}>
                        <span className="text-dark-grey font-cool-con text-2xl">
                            Start Now
                        </span>
                    </Link>
                </button>
            </div>
            <Image 
                src={image} 
                alt="Patients Dashboard on Mobile Preview" 
                height={500}
                className="border-2 border-shadow"
            />
        </div>
    );
}