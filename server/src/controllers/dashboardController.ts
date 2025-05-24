import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
    req: Request, 
    res: Response
) :  Promise<void> => {
    // This function retrieves various metrics for the dashboard
        try {
            const popularProducts = await prisma.products.findMany({
                take :15,
                orderBy: {
                    stockQuantity: 'desc',
                },
            });
            const saleSummary = await prisma.salesSummary.findMany({
                take: 5,
                orderBy: {
                    date: 'desc',
                },
            });
            const purchaseSummary = await prisma.purchaseSummary.findMany({
                take: 5,
                orderBy: { 
                    date: 'desc',
                },
            });
            const expenseSummary = await prisma.expenseSummary.findMany({
                take: 5,
                orderBy: {
                    date: 'desc',
                },
            });
            const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
                take: 5,
                orderBy: {
                    category: 'asc', 
                },
            });
            const expenseByCategorySummary = expenseByCategorySummaryRaw.map( (item) => ({
                    ...item,
                    amount: item.amount.toString(),
                })
            );
            // Convert amount to string for consistency in response
            // Return the data as a JSON response

            res.json({
                popularProducts,
                saleSummary,
                purchaseSummary,
                expenseSummary,
                expenseByCategorySummary,
            });

            
        } catch (error) {
            res.status(500).json({ error: ' Error retreving dashboard metrics' });
        }
    
    } ;
