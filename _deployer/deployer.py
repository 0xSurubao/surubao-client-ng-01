# system/base
import random
import os
import shutil
import logging
import subprocess
import mimetypes
import json
import argparse
from typing import Optional

# third
# ...

# from company
import deployer_base

# from project
# ...



# config
# _app_config = deployer_base.try_to_load_app_config_file()




# def main_OLD():
    # parser = argparse.ArgumentParser()
    # parser.add_argument('enviroment_name', type=str)
    # parser.add_argument('website_name', type=str)
    # args = parser.parse_args()

    # environment_name: str = args.enviroment_name
    # website_name: str = args.website_name
    # action_password: str = environment_name + "-" + f"{random.randint(100, 999)}"

    # senha_digitada: str = input('Digite "' + action_password + '" para continuar > ')

    # if action_password.lower() != senha_digitada.lower():
    #     print(
    #         "\n\n"
    #         + "###################### Confimation FAILED. Aborting deployment! ("
    #         + environment_name
    #         + ") ######################"
    #         + "\n\n"
    #     )
    #     return

    # print(
    #     "\n\n"
    #     + "###################### Starting deployment... ("
    #     + environment_name
    #     + ") ######################"
    #     + "\n\n"
    # )

    # handle_version()

    # # original_production_file_path = "app-enviroment-config-production.ts"
    # # original_local_file_path = "app-enviroment-config-local.ts"
    # env_file_path = "src/environments/environment." + environment_name + ".ts"

    # print("#> Setting project enviroment...")
    # # copy_file(original_production_file_path, env_file_path)
    # app_version = get_current_app_verstion()
    # # print("app_version 01 = " + app_version)
    # text_file_content_replacing(env_file_path, "M.M.P", app_version)

    # # Adiciona a chamada ao comando do terminal
    # terminal_command = (
    #     "ng build --configuration="
    #     + environment_name
    #     + " --output-path=.build/"
    #     + website_name
    #     + "/build"
    # )

    # print("#> Compiling scripts...")
    # subprocess.run(terminal_command, shell=True)

    # Defina o caminho da pasta de origem, a pasta de destino e a lista de extensões a serem excluídas
    # build_firebase_folder = "./build/" + website_name
    # root_build_folder = build_firebase_folder + "/build"
    # build_browser_folder = root_build_folder + "/browser"

    # pasta_origem = "src"
    # pasta_destino = "dist/rd-af-01-fe-02/browser"
    # extensoes_excluidas = [".ts", "tailwind.css"]

    # # Chama a função para copiar os arquivos
    # # print("#> Copying files...")
    # # clone_directory(pasta_origem, pasta_destino, extensoes_excluidas)

    # print("#> Handling text replacing...")
    # # handle_replacing_in_folder(pasta_destino, extensoes_excluidas)
    # handle_replacing_in_folder(build_browser_folder, extensoes_excluidas)

    # # Adiciona a chamada ao comando do terminal
    # terminal_command = "firebase deploy --only firestore:rules"
    # print("#> Uploading to Firestore rules...")
    # subprocess.run(terminal_command, shell=True)

    # terminal_command = "firebase deploy --only hosting:" + website_name

    # print("#> Uploading to Firebase hosting...")
    # subprocess.run(terminal_command, shell=True, cwd=build_firebase_folder)

    # print("#> Resetting project enviroment...")
    # copy_file(original_local_file_path, env_file_path)

    # app_version = get_current_app_verstion()
    # # print("app_version 02 = " + app_version)
    # text_file_content_replacing(env_file_path, app_version, "M.M.P")

    # user_input = input(
    #     '#>>> Want to update the S3 CDN (with "local-cdn" folder)? [y/N] > '
    # )

    # if user_input.lower() == "y".lower():
    #     cdn_name = get_app_cdn_name()
    #     terminal_command = (
    #         "aws s3 sync ./local-cdn s3://"
    #         + cdn_name
    #         + " --delete --cache-control max-age=31536000"
    #     )

    #     print("#> Updating...")
    #     subprocess.run(terminal_command, shell=True)

    # print(
    #     "\n\n"
    #     + "###################### Deployment process finished :) ("
    #     + environment_name
    #     + "/"
    #     + app_version
    #     + ") ######################"
    #     + "\n\n"
    # )


def copy_file(originalPath: str, goalPath: str):
    try:
        with open(originalPath, "r") as arquivo_origem:
            conteudo = arquivo_origem.read()

        with open(goalPath, "w") as arquivo_destino:
            arquivo_destino.write(conteudo)

        # print(f"Conteúdo copiado de '{origem}' para '{destino}' com sucesso.")

    except FileNotFoundError:
        print("Erro: Arquivo de origem não encontrado.")

    except Exception as e:
        print(f"Erro ao copiar o arquivo: {e}")


# def handle_replacing_in_folder(folder_path: str, ignored_extensions):
#     # Percorre os arquivos na pasta de origem
#     for root, dirs, files in os.walk(folder_path):
#         for file in files:
#             caminho_arquivo_origem = os.path.join(root, file)
#             # caminho_relativo = os.path.relpath(caminho_arquivo_origem, folder_path)
#             # caminho_arquivo_destino = os.path.join(goal_path, caminho_relativo)

#             # Verifica se o arquivo possui a extensão a ser excluída
#             if not any(
#                 caminho_arquivo_origem.endswith(ext) for ext in ignored_extensions
#             ):
#                 handle_text_replacing(caminho_arquivo_origem)
#                 # # Verifica se o arquivo não é vazio
#                 # if os.path.getsize(caminho_arquivo_origem) > 0:
#                 #     # Cria a estrutura de pastas no destino, se necessário
#                 #     pasta_destino_arquivo = os.path.dirname(caminho_arquivo_destino)
#                 #     if not os.path.exists(pasta_destino_arquivo):
#                 #         os.makedirs(pasta_destino_arquivo)

#                 #     # Copia o arquivo para a pasta de destino
#                 #     shutil.copy(caminho_arquivo_origem, caminho_arquivo_destino)
#                 #     # shutil.copyfileobj(caminho_arquivo_origem, caminho_arquivo_destino)
#                 #     # with open(caminho_arquivo_origem, 'rb') as input:
#                 #     #     shutil.copyfileobj(input, caminho_arquivo_destino)

#                 #     handle_text_replacing(caminho_arquivo_destino)
#                 #     # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
#                 #     # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
#                 #     # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
#                 #     # handle_minification(caminho_arquivo_destino)


# def clone_directory(original_path: str, goal_path: str, ignored_extensions):

#     # Remove completamente a pasta de destino, se existir
#     if os.path.exists(goal_path):
#         shutil.rmtree(goal_path)

#     # Verifica se a pasta de destino existe, senão cria
#     if not os.path.exists(goal_path):
#         os.makedirs(goal_path)

#     # Percorre os arquivos na pasta de origem
#     for root, dirs, files in os.walk(original_path):
#         for file in files:
#             caminho_arquivo_origem = os.path.join(root, file)
#             caminho_relativo = os.path.relpath(caminho_arquivo_origem, original_path)
#             caminho_arquivo_destino = os.path.join(goal_path, caminho_relativo)

#             # Verifica se o arquivo possui a extensão a ser excluída
#             if not any(
#                 caminho_arquivo_origem.endswith(ext) for ext in ignored_extensions
#             ):
#                 # Verifica se o arquivo não é vazio
#                 if os.path.getsize(caminho_arquivo_origem) > 0:
#                     # Cria a estrutura de pastas no destino, se necessário
#                     pasta_destino_arquivo = os.path.dirname(caminho_arquivo_destino)
#                     if not os.path.exists(pasta_destino_arquivo):
#                         os.makedirs(pasta_destino_arquivo)

#                     # Copia o arquivo para a pasta de destino
#                     shutil.copy(caminho_arquivo_origem, caminho_arquivo_destino)
#                     # shutil.copyfileobj(caminho_arquivo_origem, caminho_arquivo_destino)
#                     # with open(caminho_arquivo_origem, 'rb') as input:
#                     #     shutil.copyfileobj(input, caminho_arquivo_destino)

#                     handle_text_replacing(caminho_arquivo_destino)
#                     # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
#                     # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
#                     # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
#                     # handle_minification(caminho_arquivo_destino)


# def is_text_file(file_path: str):
#     tipo_mime, _ = mimetypes.guess_type(file_path)
#     return tipo_mime and tipo_mime.startswith("text")


# def text_file_content_replacing(file_path, old_text, new_text):
#     print("###### nome_arquivo = " + file_path)

#     if not is_text_file(file_path):
#         # print(f"Ignorando {nome_arquivo} porque não é um arquivo de texto.")
#         return

#     # Abrir o arquivo para leitura
#     with open(file_path, "r", encoding="utf-8") as arquivo:
#         linhas = arquivo.readlines()

#     # Verificar se o arquivo está vazio
#     if not linhas:
#         print(f"O arquivo {file_path} está vazio.")
#         return

#     # Substituir o texto antigo pelo novo em cada linha
#     linhas_modificadas = [linha.replace(old_text, new_text) for linha in linhas]

#     # Abrir o arquivo para escrita, sobrescrevendo o conteúdo anterior
#     with open(file_path, "w", encoding="utf-8") as arquivo:
#         arquivo.writelines(linhas_modificadas)


# def handle_text_replacing(file_path: str):
#     for rel in _app_config.TextReplacingList:
#         text_file_content_replacing(
#             file_path,
#             rel.OriginalText,
#             rel.ReplaceText,
#         )


def handle_minification(file_path: str):
    # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
    # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
    # ! TODO: REVIEW THIS!!!!!!!!!!!!!!!!
    minifiable_extensions = [".html", ".js", ".css"]

    # print('### 01 > Minifying... "' + caminho_arquivo + '"')

    # Verifica se o arquivo possui a extensão a ser excluída
    if any(file_path.endswith(ext) for ext in minifiable_extensions):

        terminal_command = "minify " + file_path + " > " + file_path + ".min"

        # ! TODO: ADD TIME DEBUGGING!!!!!!!!!!!!!!!!
        # ! TODO: ADD TIME DEBUGGING!!!!!!!!!!!!!!!!
        # ! TODO: ADD TIME DEBUGGING!!!!!!!!!!!!!!!!
        print('# 02> Minifying... "' + file_path + '"')
        subprocess.run(terminal_command, shell=True)


# def increment_version(version_str: str):
#     version_parts = version_str.split(".")

#     version_parts[-1] = str(int(version_parts[-1]) + 1)

#     # Junta as partes novamente usando ponto como separador
#     new_version = ".".join(version_parts)

#     return new_version


# def get_app_cdn_name():
#     file_path = "app-cnd-name.config.txt"

#     value = "UNDEFINED"

#     try:
#         # Abre o arquivo para leitura
#         with open(file_path, "r") as file:
#             # Lê a versão do arquivo
#             value = file.read().strip()

#     except FileNotFoundError:
#         print(f"O arquivo {file_path} não foi encontrado.")
#     except Exception as e:
#         print(f"Ocorreu um erro: {e}")

#     # print("value = " + value)

#     return value


# def get_current_app_verstion():
#     # Caminho para o arquivo de texto
#     file_path = "app-version.config.txt"

#     value = _app_config.
#     # print("value = " + value)

#     return value


# def handle_version():
#     # Caminho para o arquivo de texto
#     file_path = "app-version.config.txt"

#     try:
#         current_version = get_current_app_verstion()

#         # Incrementa a versão
#         new_version = increment_version(current_version)

#         # Abre o arquivo para escrita e escreve a nova versão
#         with open(file_path, "w") as file:
#             file.write(new_version)

#         # print(f'A versão foi incrementada. Nova versão: {new_version}')
#         app_version = new_version

#     except FileNotFoundError:
#         print(f"O arquivo {file_path} não foi encontrado.")
#     except Exception as e:
#         print(f"Ocorreu um erro: {e}")


def main():
    deployer_base.handle_deploy_try()

if __name__ == "__main__":
    main()














# ##### SETUP #####

