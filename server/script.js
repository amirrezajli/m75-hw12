let selectedUserId = "";
let students = []
async function updateUser() {
	const name = document.getElementById("name").value;
	const family = document.getElementById("family").value;
	const birthday = document.getElementById("birthday").value;
    const Math = document.getElementById("Math").value;
	const socialStudies = document.getElementById("socialStudies").value;
	const persian = document.getElementById("persian").value;

	try {
		await axios({
			method: "put",
			url: "http://localhost:3000/users/" + selectedUserId,
			data: { name, family, birthday, Math,socialStudies,persian},
		});

		const nameField = document.querySelector("#row-" + selectedUserId + " td:nth-child(2)");
		const familyField = document.querySelector("#row-" + selectedUserId + " td:nth-child(3)");
		const birthdayField = document.querySelector("#row-" + selectedUserId + " td:nth-child(4)");
        const MathField = document.querySelector("#row-" + selectedUserId + " td:nth-child(5)");
		const socialStudiesField = document.querySelector("#row-" + selectedUserId + " td:nth-child(6)");
		const persianField = document.querySelector("#row-" + selectedUserId + " td:nth-child(7)");

		nameField.innerHTML = name;
		familyField.innerHTML = family;
		birthdayField.innerHTML = birthday;
        MathField.innerHTML = Math;
		socialStudiesField.innerHTML = socialStudies;
		persianField.innerHTML = persian;

	} catch (err) {
		console.error(err);
		alert("Something failed");
	}

	closeModal();
}
//====================================================================close modal
function closeModal() {

	const modalElement = document.getElementById("userModal");
	const modal = bootstrap.Modal.getInstance(modalElement);
	modal.hide();
	document.getElementById("modalSubmitBtn").innerHTML = "Save";

	selectedUserId = "";
	document.getElementById("name").value = "";
	document.getElementById("family").value = "";
	document.getElementById("birthday").value = "";
    document.getElementById("Math").value = "";
	document.getElementById("socialStudies").value = "";
	document.getElementById("persian").value = "";
	document.getElementById('name-error').innerHTML = "";

}
//===================================================================onFormsubmit
function onFormSubmit() {
	if (selectedUserId !== "") updateUser();
	else saveUser();
}
//=======================================================================saveUser
async function saveUser() {
	if(!CheckEmpty()){
		return
	}
	const name = document.getElementById("name").value;
	const family = document.getElementById("family").value;
	const birthday = document.getElementById("birthday").value;
    const Math = document.getElementById("Math").value;
	const socialStudies = document.getElementById("socialStudies").value;
	const persian = document.getElementById("persian").value;
    console.log({ name, family, birthday, Math,socialStudies,persian})

	try {
		const { data } = await axios.post("http://localhost:3000/users", { name, family, birthday, Math,socialStudies,persian});
		axios({
			url:"",
			method: "post",
			body:{}
		})
        console.log(data)
		const tableBody = document.getElementById("table-body");

        // students.push(data)

		const appendData = createRow(data);

		tableBody.innerHTML += appendData;

		closeModal();
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}
}
//==============================================================================loadUsers
async function loadUsers() {
	let tableBodyContent = "";

	try {
		const { data: users } = await axios.get("http://localhost:3000/users");
        students = users
		users.forEach(user => {
			tableBodyContent += createRow(user);
		});
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}

	const tableBody = document.getElementById("table-body");
	tableBody.innerHTML = tableBodyContent;
}
//===================================================================fillFormForUpdate
function fillFormForUpdate(userid) {
	document.getElementById("modalSubmitBtn").innerHTML = "Update";
	let user = students.find(student => student.id === +userid)
	document.getElementById("name").value = user.name;
	document.getElementById("family").value = user.family;
	document.getElementById("birthday").value = user.birthday;
    document.getElementById("Math").value = user.Math;
	document.getElementById("socialStudies").value = user.socialStudies;
	document.getElementById("persian").value = user.persian;

	selectedUserId = user.id;
}
//=======================================================================deleteUser
async function deleteUser(userId) {
	try {
		await axios.delete("http://localhost:3000/users/" + userId);
		const userElement = document.getElementById("row-" + userId);
		userElement.remove();
	} catch (err) {
		console.error(err);
		alert("Something failed");
	}
}

loadUsers();
//===============================================================================
function renderUsersList() {
    counter=students.length
    const tableBody = document.getElementById("table-body");
    let tableBodyContent = ''
    students.forEach(user => {
        tableBodyContent += createRow(user);
    });
    tableBody.innerHTML = tableBodyContent;
}
//=====================================================================
let sorted = null

function sortTable(element) {
    let x = element.id

    if (x === "hMath" || x === "hSocialStudies" || x === "hPersian") {
        students = students.sort((a, b) => {
            if (sorted === x) return a[x] - b[x]
            else return b[x] - a[x]
        })
    } else {
        students = students.sort((a, b) => {
            if (sorted === x) {

                if (a[x] < b[x]) return -1
                else if (a[x] > b[x]) return 1
                else return 0
            } else {
                if (a[x] < b[x]) return 1
                else if (a[x] > b[x]) return -1
                else return 0
            }
        })
    }
    if (sorted === x) sorted = null
    else sorted = x
    console.log(students)
    renderUsersList()
}

//==============================================
function CheckEmpty(){
    if(document.getElementById('name').value === ''){
        document.getElementById('name-error').innerHTML = 'لطفا نام خود را وارد کنید!';
		document.getElementById('name-error').style.color="rgb(237,28,36)"
        return false;
        }
    else{
        document.getElementById('name-error').innerHTML = '';
    }
    
    return true;
}
//=======================================serchbox
let search =document.getElementById("searchBox")
searchBox.addEventListener("keyup", function() {
    let keyword = this.value;
    keyword = keyword.toUpperCase();
    let table = document.getElementById("table");
    let all_tr = table.getElementsByTagName("tr");
    for (let i = 0; i < all_tr.length; i++) {
        let all_columns = all_tr[i].getElementsByTagName("td");
        for (j = 0; j < all_columns.length; j++) {
            if (all_columns[j]) {
                let column_value = all_columns[j].textContent || all_columns[j].innerText;

                column_value = column_value.toUpperCase();
                if (column_value.indexOf(keyword) > -1) {
                    all_tr[i].style.display = ""; 
                    break;
                } else {
                    all_tr[i].style.display = "none";
                }
            }
        }
    }
})

//+====================createrow

function createRow(user){
	return`<tr id="row-${user.id}">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.family}</td>
            <td>${user.birthday}</td>
            <td>${user.Math}</td>
            <td>${user.socialStudies}</td>
            <td>${user.persian}</td>

            <td class="w-25">
                <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#userModal" onclick="fillFormForUpdate(${user.id})">Update</button> | 
                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        </tr>
    `
}