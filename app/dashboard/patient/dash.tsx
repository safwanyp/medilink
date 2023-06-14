import { client, executeRevokeDoctorAccessFunction, getAccount, getPatientAccessLogs, getPatientAuthAccessLogs, getPatientCurrentAccess, getPatientDocument } from "@/app/appwrite";
import { IsoDateToString } from "@/helpers/dateTimeFormat";
import { Access } from "@/models/patient_doc";
import { Models } from "appwrite";
import { ReactNode, useEffect, useState } from "react";
import AuthActionElement from "./authActionElement";
import { flushSync } from "react-dom";
import Navbar from "@/app/components/navbar";
import { Button, Loading, Popover, Table, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { BiInfoCircle } from "react-icons/bi";
import Image from "next/image";
import artwork from "@/public/assets/patient-dash-art.png";

export default function Dash({acc, setAcc}: {acc: any, setAcc: any}) {
    
    const [gotLogs, setGotLogs] = useState<boolean>(false);
    const [accessTableRows, setAccessTableRows] = useState<AccessTableRow[]>([]);
    const [authTableRows, setAuthTableRows] = useState<AuthTableRow[]>([]);
    const [firstLoadDone, setFirstLoadDone] = useState<boolean>(false);
    const [currentAccess, setCurrentAccess] = useState<Access[]>([]);
    const [revokeChildLoading, setRevokeChildLoading] = useState<boolean>(false);
    
    var patientDoc: Models.Document | undefined = undefined;

    type AccessTableRow = {
        key: string | null;
        date: string | null;
        doctor: string | null;
    }

    type AuthTableRow = {
        key: string | null;
        doctor: string | null;
        access_type: string | null;
        action: ReactNode | null;
    }

    const accessTableColumns = [
        {
            key: "date",
            label: "Date and Time",
        },
        {
            key: "doctor",
            label: "Doctor",
        }
    ];

    const authTableColumns = [
        {
            key: "doctor",
            label: "Name of Doctor",
        },
        {
            key: "access_type",
            label: "Type of Access",
        },
        {
            key: "action",
            label: "Action",
        }
    ];

    async function getPastFourAccess(doc: Models.Document) {
        if (doc !== undefined) {
            // get past four access logs
            const logs = await getPatientAccessLogs(doc, 4)
            const authLogs = await getPatientAuthAccessLogs(doc);
            const current = await getPatientCurrentAccess(doc);

            // set table rows
            if (logs) {
                for (let i = 0; i < logs.length; i++) {
                    setAccessTableRows((prev) => [...prev, {
                        key: logs[i].access_date_time,
                        date: IsoDateToString(logs[i].access_date_time as string),  // 2022-06-10T07:00:00+04:00
                        doctor: logs[i].doctor_name
                    }]);
                }

                setGotLogs(true);
            } else {
                console.log('no logs found');
            }

            if (authLogs) {
                for (let i = 0; i < authLogs.length; i++) {
                    setAuthTableRows((prev) => [...prev, {
                        key: authLogs[i].access_date_time,
                        doctor: authLogs[i].doctor_name,
                        access_type: authLogs[i].access_type,
                        action: <AuthActionElement request={authLogs[i]} />
                    }]);
                }
            }

            if (current) {
                setCurrentAccess(current);
            }
        } else {
            setGotLogs(true);
            console.log('no document found');
        }
    }

    async function listenForAccessRequests(docId: string) {
        // listen for access requests
        console.log(`listening for access requests on databases.${process.env.NEXT_PUBLIC_DATABASE_ID as string}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string}.documents.${docId}`);
        client.subscribe(
            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID as string}.collections.${process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID as string}.documents.${docId}`,
            response => {
                console.log('realtime response: ', response.payload);

                flushSync(() => {
                    patientDoc = response.payload as Models.Document;
                    setAuthTableRows([]);
                    setAccessTableRows([]);
                    getPastFourAccess(patientDoc as Models.Document);
                });
            });
    }

    async function initPage() {
        // first check if session exists
        const acc = await getAccount();
        acc ? setAcc(acc) : window.location.href = '/login';

        // then get patient's document and set it
        const tempDoc = await getPatientDocument();
        tempDoc 
            ? patientDoc = tempDoc 
            : null;
        
        // then subscribe to the patient's document for changes
        listenForAccessRequests(patientDoc?.$id as string);

        // then get past four access logs
        getPastFourAccess(patientDoc as Models.Document);

        // then set first load done
        setFirstLoadDone(true);
    }

    useEffect(() => {
        firstLoadDone ? null : initPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Navbar mode="patientDash"/>
            <div className="w-full h-full flex flex-row gap-8">
                <div className="w-9/12 h-full flex flex-col gap-5 justify-start py-3">
                    <span className="font-satoshi-med text-dark-grey text-xl">
                        Welcome back, <span className="font-satoshi-med text-orange text-xl">{acc?.name.split(' ')[0]}</span>
                    </span>
                    <div className="w-full h-auto flex flex-col gap-1">
                        <div className="w-full h-fit flex flex-row justify-between">
                            <h2 className="font-cool text-dark-grey text-2xl">Medical Record Access History</h2>
                            
                            {/* TODO: Implement view and revoke access */}
                            <Popover>
                                <Popover.Trigger>
                                    <Button
                                        auto
                                        css={{backgroundColor: 'var(--orange-light)'}}
                                        className="hover:bg-orange hover:scale-105 transform transition-all"
                                    >
                                        Doctors with Access {currentAccess.length > 0 ? `(${currentAccess.length})` : null}
                                    </Button>
                                </Popover.Trigger>
                                <Popover.Content>
                                    {
                                        currentAccess.length > 0 ? currentAccess.map((access) => (
                                            <div key={`${access.doctor_name}`} className="w-auto h-auto flex flex-col gap-2 p-2">
                                                <div className="w-full h-auto flex flex-row gap-5 justify-between items-center">
                                                    <span>{access.doctor_name}</span>
                                                    <span className="text-sm font-satoshi-med-it">Type: {access.access_type}</span>
                                                    <Button 
                                                        auto 
                                                        color='error' 
                                                        size='sm'
                                                        onPress={async () => {
                                                            await executeRevokeDoctorAccessFunction(
                                                                access.patient_id as string,
                                                                access.doctor_id as string,
                                                                access.access_type as string,
                                                                access.patient_name as string,
                                                                access.doctor_name as string,
                                                            );
                                                        }}
                                                    >
                                                        {revokeChildLoading ? <Loading color="white" type="points"/> : 'Revoke Access'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )) 
                                        : <div className="flex flex-row w-auto h-auto p-5">
                                            <span className="font-satoshi-med text-dark-grey text-lg">
                                                No doctors have access to your medical records.
                                            </span>
                                        </div>
                                    }
                                </Popover.Content>
                            </Popover>
                        </div>
                        <span className="font-satoshi-med text-dark-grey text-xl flex">
                            To view a list of all the people who have accessed your records, please click&nbsp;
                            <Link href={'/access-history'}>
                                <span className="flex font-satoshi-med text-orange text-xl cursor-pointer hover:underline">
                                here <FiArrowUpRight />
                                </span>
                            </Link>
                        </span>
                        {gotLogs ? <Table 
                            lined='true' 
                            aria-label='Medical Record Access History'
                            sticked
                            containerCss={{
                                maxWidth: '70%',
                            }}
                        >
                            <Table.Header columns={accessTableColumns}>
                                {(column) => (
                                        <Table.Column key={column.key} css={{
                                            fontSize: '1.15rem',
                                            fontFamily: 'Satoshi Medium',
                                            fontWeight: 'normal',
                                            color: 'var(--off-white)',
                                            backgroundColor: 'var(--dark-blue)',
                                        }}>
                                            {column.label}
                                        </Table.Column>
                                    )}
                            </Table.Header>
                            <Table.Body items={accessTableRows}>
                                {(items) => (
                                    <Table.Row key={items.key} css={{fontSize: '1rem'}}>
                                        <Table.Cell>{items.date}</Table.Cell>
                                        <Table.Cell>{items.doctor}</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table> : <Loading color="warning" />}
                        {gotLogs ? <div className="w-[70%] h-auto flex flex-row justify-end items-center gap-2 -my-0">
                            <span className="text-xs">Table will only show the last 4 access logs.</span>
                            <Tooltip content={
                                <span className="flex flex-row justify-center text-center">
                                    If there are less than 4 records, it means your details <br />haven&apos;t been accessed more than 4 times.
                                </span>
                            }>
                                <BiInfoCircle className="text-sm self-center" />
                            </Tooltip>
                        </div> : null}
                    </div>
                    <div className="w-full h-auto flex flex-col gap-1">
                        <h2 className="font-cool text-dark-grey text-2xl">Authorization Portal</h2>
                        <span className="font-satoshi-med text-dark-grey text-xl flex">
                            Any access requests will show up here. You are free to approve or reject the access request as per your wishes.
                        </span>
                        <Table 
                            lined='true' 
                            aria-label='Authorization Portal'
                            sticked
                            containerCss={{
                                maxWidth: '70%',
                            }}
                        >
                            <Table.Header columns={authTableColumns}>
                                {(column) => (
                                        <Table.Column key={column.key} css={{
                                            fontSize: '1.15rem',
                                            fontFamily: 'Satoshi Medium',
                                            fontWeight: 'normal',
                                            color: 'var(--off-white)',
                                            backgroundColor: 'var(--dark-blue)',
                                        }}>
                                            {column.label}
                                        </Table.Column>
                                    )}
                            </Table.Header>
                            <Table.Body items={authTableRows}>
                                {(items) => (
                                    <Table.Row key={items.key} css={{fontSize: '1rem'}}>
                                        <Table.Cell>{items.doctor}</Table.Cell>
                                        <Table.Cell>{items.access_type}</Table.Cell>
                                        <Table.Cell>{items.action}</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <div className="w-3/12 h-full flex flex-col justify-center items-center">
                    <Image src={artwork} height={350} alt="Patient Dashboard Artwork" />
                </div>
            </div>
        </>
    )
}