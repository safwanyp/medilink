import DoctorsProcess from "./doctors";
import PatientsProcess from "./patients";

export default function Process() {
    return (
        <div className="w-full h-auto flex flex-col pt-16">
            <h2 className="text-4xl font-satoshi-bold-it text-dark-grey">How it works</h2>
            <PatientsProcess />
            <DoctorsProcess />
        </div>
    )
}