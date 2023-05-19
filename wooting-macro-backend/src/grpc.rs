use log::*;

use tonic::Request;
use tonic::Response;
use tonic::Status;
use wooting_service::app_profile_linking_service_client::*;

use wooting_service::SetOnboardProfileRequest;
use wooting_service::SetOnboardProfileResponse;

#[allow(unused)]
use itertools::Itertools;

use self::wooting_service::app_profile_linking_service_server::AppProfileLinkingService;

// use wooting_service::application_type_p::Types;

// pub mod profiles {
//     tonic::include_proto!("profiles");
// }
pub mod wooting_service {
    tonic::include_proto!("wooting_service");
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, Default)]
pub struct ProfileNumber {
    pub data: u8,
}

#[tonic::async_trait]
impl AppProfileLinkingService for ProfileNumber {
    async fn set_onboard_profile_keyboard(
        &self,
        data: Request<SetOnboardProfileRequest>,
        //client: &mut AppProfileLinkingServiceClient<tonic::transport::Channel>,
        //request: tonic::Request<SetOnboardProfileRequest>,
    ) -> std::result::Result<Response<SetOnboardProfileResponse>, Status> {
        let mut client = AppProfileLinkingServiceClient::connect("http://127.0.0.1:50051")
            .await
            .unwrap();
        let request = tonic::Request::new(SetOnboardProfileRequest {
            profile_number: data.into_inner().profile_number,
        });

        debug!("Setting profile...");
        let response = client.set_onboard_profile_keyboard(request).await.unwrap();

        Ok(Response::new(SetOnboardProfileResponse {
            success: response.into_inner().success,
        }))
    }
}

pub async fn set_profile(data: u32) {
    let converted_number = ProfileNumber { data: data as u8 };

    match converted_number
        .set_onboard_profile_keyboard(tonic::Request::new(SetOnboardProfileRequest {
            profile_number: data,
        }))
        .await
        .unwrap()
        .into_inner()
        .success
    {
        true => debug!("Success setting a profile"),
        false => debug!("Success setting a profile"),
    };
}
