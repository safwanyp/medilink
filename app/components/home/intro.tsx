import landingArt from "../../../public/assets/landing-art.png";
import Image from "next/image";

export default function Intro() {
    return (
        <div className="w-full h-auto flex flex-row justify-between gap-16 mt-10 border border-shadow rounded-lg px-8 py-8 bg-tora bg-cover bg-opacity-50 hover:shadow-[3px_4px_0px_0px_rgba(238,151,106,1)] transition-all duration-300">
            <div className="flex flex-col h-auto">
            <h3 className="text-4xl font-satoshi-bold-it text-dark-grey">What we do</h3>
            <div className="w-full h-full flex flex-col gap-10">
                <p className="font-satoshi-med text-dark-grey">
                Communicating your health-related information to doctors can be overwhelming. <span className="font-satoshi-med-it">“I hope I mentioned everything.”</span>, <span className="font-satoshi-med-it">“Did I tell them about my medications?”</span>, are just a few of the thoughts that go through people’s minds.
                </p>
                <p className="font-satoshi-med text-dark-grey">
                With <span><span className="font-satoshi-bold text-dark-grey">Medi</span><span className="font-satoshi-med text-orange-light">Link</span></span>, we strive to eliminate the human error that might creep in while talking about your medical details. <br />But how do we do this?
                </p>
                <p className="font-satoshi-med text-dark-grey">
                Scroll down to find out.
                </p>
            </div>
            </div>
        <Image src={landingArt} alt="Landing Art" height={320}/>
      </div>
    )
}