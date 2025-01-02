import toast from "react-hot-toast";

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? "http://localhost" : process.env.NEXT_PUBLIC_BASE_URL;

export const makeRequest = (
  endpoint: string,
  options: { method: string; body: Object },
  next: {
    onSuccess: (value: Response) => void;
    onError: (value: Response) => void;
    finally?: () => void;
  }
) => {
  return fetch(`${baseUrl}/${endpoint}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.body),
  })
    .then((res) => {
      if (res.ok) {
        return next.onSuccess(res);
      } else {
        if (res.status === 429) {
          toast.error(
            "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
          );
          return;
        }
        next.onError(res);
      }
    })
    .catch(() =>
      toast.error("خطا در ارتباط با سرور. لطفا اینترنت خود را بررسی کنید.")
    )
    .finally(next.finally);
};
