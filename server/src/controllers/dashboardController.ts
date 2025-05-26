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
            const salesSummary = await prisma.salesSummary.findMany({
               
                orderBy: {
                    date: 'desc',
                },
            });
            const purchaseSummary = await prisma.purchaseSummary.findMany({
                
                orderBy: { 
                    date: 'desc',
                },
            });
            const expenseSummary = await prisma.expenseSummary.findMany({
                
                orderBy: {
                    date: 'desc',
                },
            });
            const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
                
                orderBy: {
                    category: 'desc', 
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
                salesSummary,
                purchaseSummary,
                expenseSummary,
                expenseByCategorySummary,
            });

            
        } catch (error) {
            res.status(500).json({ error: ' Error retreving dashboard metrics' });
        }
    
    } ;
