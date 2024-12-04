import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lyrics } = await req.json();

    if (!lyrics) {
      return NextResponse.json(
        { error: "Lyrics are required to generate music." },
        { status: 400 }
      );
    }

    const prompt = lyrics.join(" ");
    const apiKey = process.env.PIAPI_API_KEY || "";

    const retryFetch = async (
      maxRetries: number,
      delay: number
    ): Promise<any> => {
      let attempts = 0;
      while (attempts < maxRetries) {
        try {
          const response = await fetch("https://api.piapi.ai/api/v1/task", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
            body: JSON.stringify({
              model: "music-u",
              task_type: "music_generation",
              input: {
                prompt,
                lyrics_type: "user",
                seed: Math.floor(Math.random() * 1000000000), // Random seed for diversity
              },
            }),
          });

          const data = await response.json();
          console.log(data.data.task_id);
          console.log(data);
          

          function retry(task_id:string) {
            
            const delay = 5000; // 2 seconds delay between retries
          
            const checkTaskStatus = () => {
              fetch(`https://api.piapi.ai/api/v1/task/${task_id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": apiKey,
                },
              })
                .then((response) => response.json())
                .then((result) => {
                  console.log("Task Status:", result);
          
                  // Check if the status is "failed" or "success"
                  if (result.status === "failed") {
                    console.error("Task failed.");
                    return;
                  }
          
                  if (result.status === "success") {
                    console.log("Task succeeded:", result);
                    return;
                  }
          
                  // If not "failed" or "success", retry after delay
                  console.log("Retrying...");
                  setTimeout(checkTaskStatus, delay);
                })
                .catch((error) => {
                  console.error("Error while checking task status:", error);
                });
            };
          
            // Start the first status check
            checkTaskStatus();
          }
          
          retry(data.data.task_id)
          console.log(retry)

          console.log(`Attempt ${attempts + 1}:`, data);

          // Check for success condition
          if (response.ok && data?.data?.output?.musicUrl) {
            return {
              success: true,
              musicUrl: data.data.output.musicUrl,
            };
          }

          console.warn(`Attempt ${attempts + 1} failed. Retrying...`);
        } catch (error) {
          console.error(`Error on attempt ${attempts + 1}:`, error);
        }

        // Wait before retrying
        attempts++;
        if (attempts < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      return {
        success: false,
        error: "Failed to generate music after retries.",
      };
    };

    // Call the retry function with a maximum of 5 retries and a 2-second delay
    const result = await retryFetch(10, 5000);
 

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      message: "Music generated successfully!",
      musicUrl: result.musicUrl,
    });
  } catch (error) {
    console.error("Error in /api/suno:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
    
  }
}
