import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get environment variables (without using them to initialize Firebase)
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    // Check environment variables
    const envStatus = {
      projectId: projectId ? "Available" : "Missing",
      clientEmail: clientEmail ? "Available" : "Missing",
      privateKey: privateKey ? "Available" : "Missing",
      privateKeyFormat: privateKey
        ? privateKey.includes("-----BEGIN PRIVATE KEY-----")
          ? "Properly formatted"
          : "Needs formatting (\\n replacement)"
        : "N/A",
      nodeVersion: process.version,
    }

    return NextResponse.json({
      success: true,
      message: "Environment variables checked",
      envStatus,
    })
  } catch (error) {
    console.error("Error checking environment:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to check environment",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
