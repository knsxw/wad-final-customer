"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerDetailPage() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams();
    const router = useRouter();

    const [customer, setCustomer] = useState(null);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`${API_BASE}/customer/${params.id}`);
            if (!res.ok) throw new Error("Customer not found");
            const data = await res.json();
            setCustomer({
                ...data,
                dateOfBirth: data.dateOfBirth
                    ? new Date(data.dateOfBirth).toISOString().split("T")[0]
                    : "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to fetch customer");
            router.back();
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [params.id]);

    if (!customer) {
        return <p className="m-4">Loading...</p>;
    }

    return (
        <main className="m-4 max-w-md border p-4 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Customer Details</h1>

            <div className="mb-2">
                <strong>Name:</strong> {customer.name}
            </div>
            <div className="mb-2">
                <strong>Date of Birth:</strong> {customer.dateOfBirth}
            </div>
            <div className="mb-2">
                <strong>Member Number:</strong> {customer.memberNumber}
            </div>
            <div className="mb-2">
                <strong>Interests:</strong> {customer.interests}
            </div>

            <div className="mt-4 flex gap-2">
                <Link
                    href="/customer"
                    className="px-4 py-2 bg-gray-700 text-white rounded"
                >
                    Back
                </Link>
                <Link
                    href={`/customer`}
                    className="px-4 py-2 bg-blue-700 text-white rounded"
                >
                    Edit
                </Link>
            </div>
        </main>
    );
}
