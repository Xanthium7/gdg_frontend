"use server";

// API base URL - replace with your actual FastAPI server URL (localhost:8000 by default)
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Create a new chat session
 * @returns Object containing session_id and empty messages array
 */
export async function createChatSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error creating session: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create chat session:", error);
    throw error;
  }
}

/**
 * Send a message to the Malayalam-speaking chatbot and get a response
 * @param sessionId The chat session ID
 * @param messageContent The user's message
 * @returns Object containing session_id and the AI response in Malayalam
 */
export async function sendChatMessage(
  sessionId: string,
  messageContent: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: messageContent,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error sending message: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

/**
 * Get chat history for a session
 * @param sessionId The chat session ID
 * @returns Object containing session_id and messages array
 */
export async function getChatHistory(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error retrieving chat history: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get chat history:", error);
    throw error;
  }
}
