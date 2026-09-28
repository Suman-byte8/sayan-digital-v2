import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

const ORDER_SUMMARY_SELECT = {
  select: {
    id: true,
    orderNumber: true,
    status: true,
    user: { select: { name: true, email: true } },
  },
};

function serializeTask(task) {
  const { order, ...rest } = task;
  return {
    ...rest,
    ...(order
      ? {
          order: {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            customerName: order.user?.name ?? null,
          },
        }
      : { order: null }),
  };
}

// No auth — internal-only tool, same trust model as the rest of the
// admin-facing endpoints (see admin-users.controller.js).
export async function listTasks(req, res) {
  const { page, limit, status, search } = req.validated.query;

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { order: ORDER_SUMMARY_SELECT },
    }),
    prisma.task.count({ where }),
  ]);

  res.json({
    success: true,
    data: tasks.map(serializeTask),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}

export async function getTask(req, res) {
  const { id } = req.validated.params;
  const task = await prisma.task.findUnique({ where: { id }, include: { order: ORDER_SUMMARY_SELECT } });
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ success: true, data: serializeTask(task) });
}

// Manual task creation — orders create their own via orders.controller.js's
// createOrder, not this endpoint.
export async function createTask(req, res) {
  const { orderId, ...rest } = req.validated.body;

  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true } });
    if (!order) throw new ApiError(404, "Order not found");
  }

  const task = await prisma.task.create({
    data: { ...rest, orderId: orderId ?? null },
    include: { order: ORDER_SUMMARY_SELECT },
  });
  res.status(201).json({ success: true, data: serializeTask(task) });
}

export async function updateTask(req, res) {
  const { id } = req.validated.params;
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Task not found");

  const { orderId, ...rest } = req.validated.body;
  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true } });
    if (!order) throw new ApiError(404, "Order not found");
  }

  const task = await prisma.task.update({
    where: { id },
    data: { ...rest, ...(orderId !== undefined ? { orderId } : {}) },
    include: { order: ORDER_SUMMARY_SELECT },
  });
  res.json({ success: true, data: serializeTask(task) });
}

export async function deleteTask(req, res) {
  const { id } = req.validated.params;
  const { count } = await prisma.task.deleteMany({ where: { id } });
  if (count === 0) throw new ApiError(404, "Task not found");
  res.status(204).send();
}
