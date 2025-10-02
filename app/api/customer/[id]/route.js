import Customer from "@/models/Customer";

// GET single customer
export async function GET(request, { params }) {
    const customer = await Customer.findById(params.id);
    if (!customer) {
        return new Response("Customer not found", { status: 404 });
    }
    return Response.json(customer);
}

// UPDATE customer
export async function PUT(request, { params }) {
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(params.id, body, { new: true });
    if (!customer) {
        return new Response("Customer not found", { status: 404 });
    }
    return Response.json(customer);
}

// DELETE customer
export async function DELETE(request, { params }) {
    const customer = await Customer.findByIdAndDelete(params.id);
    if (!customer) {
        return new Response("Customer not found", { status: 404 });
    }
    return Response.json({ message: "Customer deleted successfully" });
}
