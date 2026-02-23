const API = "/api";

function saveToken(token) {
  const now = new Date()
  const item = {
		token: token,
		expiry: now.getTime() + 1800000,
	}
  localStorage.setItem("token", JSON.stringify(item));
}

function getToken() {
  const itemStr = localStorage.getItem("token");
  const item = JSON.parse(itemStr)
	const now = new Date()
  if (now.getTime() > item.expiry) {
		localStorage.removeItem("token")
		return null
	}
  return item.value();
}
