import random
import os
import shutil
import logging
import subprocess
import mimetypes
import json
import argparse
from typing import Optional

class TextReplaceRelation:
    def __init__(self, OriginalText: str, ReplaceText: str):
        self.OriginalText = OriginalText
        self.ReplaceText = ReplaceText

class AppConfig:
    def __init__(self, AppVersion: str, HostingNamesByEnviroment, CdnS3BucketName: str, TextReplacingList: list):
        self.AppVersion = AppVersion
        self.HostingNamesByEnviroment = HostingNamesByEnviroment
        self.CdnS3BucketName = CdnS3BucketName
        self.TextReplacingList = [TextReplaceRelation(**item) for item in TextReplacingList]


# region Config
# texts colors
_app_config_file_path = ".app.config.json"
_app_config_fake_version_pattern = "M.M.P"

# texts colors
_red_text_tag = "\033[31m"
_green_text_tag = "\033[32m"
_yellow_text_tag = "\033[33m"
_blue_text_tag = "\033[34m"
_reset_color_text_tag = "\033[0m"
# endregion Config

# region Controller
def get_deploy_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('enviroment_name', type=str)
    args = parser.parse_args()
    
    return args

def get_deploy_env_name():
    deploy_args = get_deploy_args()
    environment_name: str = deploy_args.enviroment_name
    
    return environment_name

def handle_safety_check(environment_name: str) -> bool:
    success = False

    action_password: str = environment_name + "-" + f"{random.randint(100, 999)}"
    typed_action_password: str = input(
        _yellow_text_tag + "Type " + _reset_color_text_tag +
        "\"" + action_password + "\"" +
        _yellow_text_tag + " to continue" + _reset_color_text_tag + " " +
        ">" +
        "")

    success = action_password.lower() == typed_action_password.lower()

    return success
# endregion Controller

# region Controller - Files
def is_text_file(file_path: str):
    tipo_mime, _ = mimetypes.guess_type(file_path)
    return tipo_mime and tipo_mime.startswith("text")

def text_file_content_replacing(file_path, old_text, new_text):
    if not is_text_file(file_path):
        print(f'$ > Ignoring "{file_path}" file text replacing')
        return

    # opening file for reading
    with open(file_path, "r", encoding="utf-8") as arquivo:
        lines = arquivo.readlines()

    # checking if it is empty
    if not lines:
        print(f'$ > Ignoring "{file_path}" file because it IS EMPITY!')
        return

    # replacing content line-by-line
    new_lines = [line.replace(old_text, new_text) for line in lines]

    # opening file for writing
    with open(file_path, "w", encoding="utf-8") as arquivo:
        arquivo.writelines(new_lines)
# endregion Controller - Files

# region Controller - Config
def try_to_load_app_config_file():
    global _app_config_file_path
    app_config: Optional[AppConfig] = None

    try:
        with open(_app_config_file_path, "r") as json_file:
            config_data = json.load(json_file)
            app_config = AppConfig(**config_data)

    except json.decoder.JSONDecodeError as exception:
        print(f"$$$ > ERROR trying to open \".app.config.json\" file! exception = {exception}")
        exit()

    except FileNotFoundError:
        print("$$$ > \".app.config.json\" file not found!")
        exit()

    return app_config

def try_to_save_app_config_file(app_config: AppConfig):
    with open(_app_config_file_path, "w") as json_file:
        json.dump(app_config, json_file, indent=4, default=vars)

def increment_app_version():
    print("> Incrementing project version...")
    app_config = try_to_load_app_config_file()
    app_config.AppVersion = increment_version(app_config.AppVersion)
    try_to_save_app_config_file(app_config)

def increment_version(base_version: str):
    version_parts = base_version.split(".")
    version_parts[-1] = str(int(version_parts[-1]) + 1)
    
    new_version = ".".join(version_parts)
    return new_version
# endregion Controller - Config
        
# region Controller - Version
def apply_real_version_on_relative_env_file(environment_name: str, current_app_version):
    print("> Applying project version on relative enviroment...")
    env_file_path = "src/environments/environment." + environment_name + ".ts"
    
    text_file_content_replacing(env_file_path, current_app_version, _app_config_fake_version_pattern)

def reset_fake_version_on_relative_env_file(environment_name: str, current_app_version):
    print("> Applying project version on relative enviroment...")
    env_file_path = "src/environments/environment." + environment_name + ".ts"
    
    text_file_content_replacing(env_file_path,_app_config_fake_version_pattern,  current_app_version)
# endregion Controller - Version

def build_angular_project(environment_name: str, out_put_foulder_name: str):
    print("> Compiling Angular project...")

    terminal_command = (
        "ng build --configuration="+
        environment_name +
        " --output-path=.build/" +
        out_put_foulder_name + "/build" +
        ""
    )

    subprocess.run(terminal_command, shell=True)

# region Main
def handle_deploy_try():
    environment_name: str = get_deploy_env_name()

    # !!! DEBUG ONLY!
    # !!! DEBUG ONLY!
    # !!! DEBUG ONLY!
    # safety_check_success = handle_safety_check(environment_name)
    
    # if (safety_check_success is False):
    #     print(
    #         "\n" + "\n" +
    #         _red_text_tag +
    #         "Confimation FAILED!!!. Aborting deployment! (" +
    #         environment_name +
    #         ")" +
    #         _reset_color_text_tag +
    #         "\n" +
    #         ""
    #     )
    #     return
    # !!! DEBUG ONLY!
    # !!! DEBUG ONLY!
    # !!! DEBUG ONLY!
    
    increment_app_version()
    app_config = try_to_load_app_config_file()

    apply_real_version_on_relative_env_file(environment_name, app_config.AppVersion)
    build_angular_project(environment_name, app_config.HostingNamesByEnviroment[environment_name])




    reset_fake_version_on_relative_env_file(environment_name, app_config.AppVersion)
# endregion Main
