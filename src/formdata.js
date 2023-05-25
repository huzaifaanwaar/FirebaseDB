import axios from "axios";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const Formdata = () => {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [isUpdateBtn, setIsUpdateBtn] = useState(false);
  const [updateKey, setUpdateKey] = useState(null);

  const enterdata = () => {
    const dataArray = [];
    axios
      .get("https://form-data-fe12f-default-rtdb.firebaseio.com/formdata.json")
      .then((response) => {
        console.log(response.data);
        Object.keys(response.data).forEach((key) => {
          dataArray.push({ ...response.data[key], id: key });
        });
        console.log(dataArray);
        setData(dataArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteHandler = (key) => {

    axios
      .delete(
        `https://form-data-fe12f-default-rtdb.firebaseio.com/formdata/${key}.json`
      )
      .then((response) => {
  
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    enterdata();
  }, []);


  const updateHandler = (key) => {
    setIsUpdateBtn(true)
    setUpdateKey(key)
    axios
      .get(`https://form-data-fe12f-default-rtdb.firebaseio.com/formdata/${key}.json`)
      .then((response) => {
        console.log(response.data);
        setDataUpdate(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

 
    const submitData = async (values) => {
      const headers = {
        "Content-Type": "application/json",
      };
  
      const data = {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
      };
  
      const result = await axios.post(
        "https://form-data-fe12f-default-rtdb.firebaseio.com/formdata.json",
        data,
        headers
      );
    };

    const updateData = async (values) => {
      const headers = {
        "Content-Type": "application/json",
      };
  
      const data = {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
      };
  
      try {
        const result = await axios.put(
          `https://form-data-fe12f-default-rtdb.firebaseio.com/formdata/${updateKey}.json`,
          data,
          headers
        );
        console.log(result);
      } catch(e) {
        console.log(e);
      }
    };

  return (
    <>
    <>
      <div className="container bg-light align-center text-white mb-5 mt-5 p-5 w-50">
        <Formik
          initialValues={{
            fullname: dataUpdate.fullname ?? "",
            email: dataUpdate.email ?? "",
            password: "",
            confirm_password: "",
          }}
          enableReinitialize
          validationSchema={Yup.object({
            fullname: Yup.string()
              .min(4, "Too Short!")
              .max(50, "Too Long!")
              .required("ٖFull name is Required"),
            email: Yup.string()
              .email("Invalid email")
              .required("Email is Requried"),
            password: Yup.string()
              .min(8, "password must be at least 8 characters")
              .required("Password is requried"),
            confirm_password: Yup.string()
              .oneOf([Yup.ref("password"), null], "Password must be match")
              .required("Confirm password is requried"),
          })}
          onSubmit={(values) => {
            console.log("values", values);
            if(updateKey) {
              updateData(values);
            } else {
              submitData(values);
            }
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <h3 className="text-center fs-2 text-dark">Sign Up</h3>
              <hr />
              <div className="col">
                <label className="text-dark">Full Name :</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  {...formik.getFieldProps("fullname")}
                />
                {formik.touched.fullname && formik.errors.fullname ? (
                  <div className="text-danger">{formik.errors.fullname}</div>
                ) : null}
              </div>
              <br />
              <div className="col">
                <label className="text-dark">Email :</label>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Email"
                  placeholder="Email"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger">{formik.errors.email}</div>
                ) : null}
              </div>

              <br />
              <div className="row">
                <div className="col-6">
                  <label className="text-dark">Password :</label>
                  <input
                    type="password"
                    className="form-control"
                    aria-label="Password"
                    placeholder="Password"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className="col-6">
                  <label className="text-dark">Confirm Password :</label>
                  <input
                    type="password"
                    className="form-control"
                    aria-label="Confirm Password"
                    placeholder="Confirm Password"
                    {...formik.getFieldProps("confirm_password")}
                  />
                  {formik.touched.confirm_password &&
                  formik.errors.confirm_password ? (
                    <div className="text-danger">
                      {formik.errors.confirm_password}
                    </div>
                  ) : null}
                </div>
              </div>
              <br />
              <div class="d-grid gap-2 w-50 ">
                <button className="btn btn-dark" type="submit">
                  {isUpdateBtn ? "Update" : "Sign Up"}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col">Delete Data</th>
          </tr>
        </thead>
        <tbody>
          {data.map((value, index) => (
            <tr key={index}>
              <td>{value.fullname}</td>
              <td>{value.email}</td>
              <td>{value.password}</td>
              <td>
                <button className="btn btn-danger me-2" onClick={() => deleteHandler(value.id)}>
                  Delete
                </button>
                <button className="btn btn-success" onClick={() => updateHandler(value.id)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Formdata;
