
import { toast } from "sonner";
import { AITransactionResponse } from "./types";

export const analyzeTransaction = async (prompt: string): Promise<AITransactionResponse | null> => {
  try {
    // In a real implementation, this would make a call to OpenAI API
    // For now, we'll return a mock response based on keywords in the prompt
    
    // Mock implementation for demo purposes
    const mockAnalyze = (text: string): AITransactionResponse => {
      const lowerText = text.toLowerCase();
      
      // Default values
      let type: 'income' | 'expense' | 'purchase' | 'sale' = 'expense';
      let amount = Math.floor(Math.random() * 1000) + 10;
      let category = 'Miscellaneous';
      
      // Determine type based on keywords
      if (lowerText.includes('sold') || lowerText.includes('sale') || lowerText.includes('revenue')) {
        type = 'sale';
      } else if (lowerText.includes('bought') || lowerText.includes('purchased') || lowerText.includes('acquisition')) {
        type = 'purchase';
      } else if (lowerText.includes('received') || lowerText.includes('earned') || lowerText.includes('income')) {
        type = 'income';
      } else if (lowerText.includes('spent') || lowerText.includes('paid') || lowerText.includes('expense')) {
        type = 'expense';
      }
      
      // Extract amount if it exists in the text
      const amountMatch = text.match(/\$([0-9,]+(\.[0-9]{2})?)/);
      if (amountMatch) {
        amount = parseFloat(amountMatch[1].replace(',', ''));
      }
      
      // Determine category based on keywords
      if (lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('dinner') || lowerText.includes('restaurant')) {
        category = 'Food & Dining';
      } else if (lowerText.includes('transport') || lowerText.includes('uber') || lowerText.includes('taxi') || lowerText.includes('travel')) {
        category = 'Transportation';
      } else if (lowerText.includes('office') || lowerText.includes('supplies') || lowerText.includes('equipment')) {
        category = 'Office Supplies';
      } else if (lowerText.includes('salary') || lowerText.includes('wage')) {
        category = 'Salary';
      } else if (lowerText.includes('rent') || lowerText.includes('lease')) {
        category = 'Rent';
      } else if (lowerText.includes('client') || lowerText.includes('customer')) {
        category = 'Client Payment';
      }
      
      return {
        type,
        amount,
        description: text,
        category,
        date: new Date().toISOString().split('T')[0],
      };
    };
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockAnalyze(prompt);
    
    // This is how the OpenAI implementation would look:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a financial assistant that helps categorize business transactions. 
            Analyze the transaction description and return a JSON object with the following fields:
            - type: one of "income", "expense", "purchase", "sale"
            - amount: the numeric amount of the transaction
            - description: a clean description of the transaction
            - category: the appropriate accounting category
            - date: the date of the transaction in YYYY-MM-DD format, use today if not specified`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
    */
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    toast.error('Failed to analyze transaction. Please try again.');
    return null;
  }
};
