export default function CheckEmail({setShow = (val: boolean) => {}}) {
    async function handleSubmit() {}


    return (
        <div className="absolute w-screen h-screen bg-black bg-opacity-60 z-50 grid place-items-center">
            <div className="w-11/12 md:w-1/3 h-auto p-5 bg-cream rounded-md flex flex-col gap-5 items-center">
                <span className="font-cool text-dark-grey text-2xl">Verification Email Sent</span>
                <span className="font-satoshi-med text-dark-grey text-xl text-left">Please check your email for the link to verify your account.</span>
                <span className="font-satoshi-med text-dark-grey text-xl text-left">Make sure to check your spam/junk folder as well!</span>
                <button className="w-full p-3 bg-orange rounded-md grid place-items-center shadow-[0px_4px_0px_0px_rgba(238,151,106,1)] hover:shadow-none transition-all duration-300" onClick={() => {
                    setShow(false);
                    window.location.href = "/dashboard";
                }}>
                    <span className="text-lg font-satoshi-med text-dark-grey">Close</span>
                </button>
            </div>
        </div>
    );
}
